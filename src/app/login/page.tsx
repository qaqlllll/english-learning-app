import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">English Learning App</CardTitle>
          <CardDescription className="text-center">
            Login or create an account to start learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="m@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button formAction={login} variant="default">Log in</Button>
              <Button formAction={signup} variant="outline">Sign up</Button>
            </div>
            
            {params?.message && (
              <div className="text-sm text-red-500 text-center mt-4">
                {params.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
