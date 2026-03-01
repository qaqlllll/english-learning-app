import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ImportJsonDialog } from '@/components/ImportJsonDialog'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/submit-button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { signOut } from '@/app/actions'
import { deleteVocabularySet } from './actions'
import { ModeToggle } from '@/components/mode-toggle'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sets, error } = await supabase
    .from('vocabulary_sets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Failed to load vocabulary sets</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Vocabulary Sets</h1>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <ImportJsonDialog />
          <form action={signOut}>
            <SubmitButton variant="ghost" pendingText="Signing out...">Sign out</SubmitButton>
          </form>
        </div>
      </header>

      {sets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t created any vocabulary sets yet.</p>
          <ImportJsonDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <Card key={set.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{set.title}</CardTitle>
                <CardDescription>Created on {new Date(set.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/learn/${set.id}`}>
                  <Button className="w-full">Start Learning</Button>
                </Link>
              </CardContent>
              <CardFooter className="flex justify-end pt-2 border-t">
                <form action={deleteVocabularySet}>
                  <input type="hidden" name="id" value={set.id} />
                  <SubmitButton variant="destructive" size="sm" pendingText="Deleting...">Delete</SubmitButton>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
