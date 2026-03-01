import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowLeft, BookOpen, Brain, Pencil, Workflow } from 'lucide-react'

export default async function StudyHub({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: set, error } = await supabase
    .from('vocabulary_sets')
    .select('*, words(*)')
    .eq('id', setId)
    .single()

  if (error || !set) {
    redirect('/dashboard')
  }

  const modes = [
    {
      title: 'Flashcards',
      description: 'Memorize words with classic flip cards.',
      icon: BookOpen,
      href: `/learn/${setId}/flashcards`,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Quiz',
      description: 'Test your knowledge with multiple choice questions.',
      icon: Brain,
      href: `/learn/${setId}/quiz`,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Spelling',
      description: 'Practice writing the words correctly.',
      icon: Pencil,
      href: `/learn/${setId}/spelling`,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Sentences',
      description: 'Learn usage by building correct sentences.',
      icon: Workflow,
      href: `/learn/${setId}/sentences`,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{set.title}</h1>
        <p className="text-gray-500 mt-2">{set.words.length} words in this set</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((mode) => (
          <Link key={mode.title} href={mode.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${mode.color}`}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <CardTitle>{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
