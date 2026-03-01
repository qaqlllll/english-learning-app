import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SpellingSession } from '@/components/SpellingSession'

export default async function SpellingPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: set, error } = await supabase
    .from('vocabulary_sets')
    .select('title, words(*)')
    .eq('id', setId)
    .single()

  if (error || !set) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="flex items-center mb-8">
        <Link href={`/learn/${setId}`} className="text-gray-500 hover:text-gray-900 mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">{set.title} - Spelling</h1>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <SpellingSession words={set.words} setId={setId} />
      </div>
    </div>
  )
}
