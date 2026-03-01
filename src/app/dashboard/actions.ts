'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ImportWord } from '@/types'

export async function createVocabularySet(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const file = formData.get('file') as File

  if (!title || !file) {
    throw new Error('Missing title or file')
  }

  const text = await file.text()
  let words: ImportWord[] = []

  try {
    words = JSON.parse(text)
  } catch (e) {
    throw new Error('Invalid JSON format')
  }

  if (!Array.isArray(words)) {
    throw new Error('JSON content must be an array of words')
  }

  // Create the set
  const { data: set, error: setError } = await supabase
    .from('vocabulary_sets')
    .insert({
      user_id: user.id,
      title,
    })
    .select()
    .single()

  if (setError) {
    throw new Error('Failed to create vocabulary set')
  }

  // Insert words
  const wordsToInsert = words.map((w) => ({
    set_id: set.id,
    word: w.word,
    definition: w.definition,
    definition_zh: w.definition_zh,
    example: w.example,
    mastered: false,
  }))

  const { error: wordsError } = await supabase
    .from('words')
    .insert(wordsToInsert)

  if (wordsError) {
    // Optionally delete the set if words insertion fails?
    // For now just throw error
    throw new Error('Failed to insert words: ' + wordsError.message)
  }

  revalidatePath('/dashboard')
}

export async function deleteVocabularySet(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) throw new Error('Missing set ID')

  const { error } = await supabase
    .from('vocabulary_sets')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete set')
  }

  revalidatePath('/dashboard')
}
