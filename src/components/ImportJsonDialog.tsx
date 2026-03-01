'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createVocabularySet } from '@/app/dashboard/actions'

export function ImportJsonDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      await createVocabularySet(formData)
      setOpen(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import JSON</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Vocabulary Set</DialogTitle>
          <DialogDescription>
            Upload a JSON file containing an array of words.
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md space-y-2">
            <p className="font-medium">How to generate with AI:</p>
            <p className="text-xs">Copy this prompt to ChatGPT/Claude to generate your word list:</p>
            <div className="bg-background border p-2 rounded text-xs font-mono whitespace-pre-wrap select-all">
{`Generate a JSON array of 20 English vocabulary words about [TOPIC]. 
Strictly follow this format for each object:
[
  {
    "word": "example",
    "definition": "English definition",
    "definition_zh": "Chinese definition (Traditional)",
    "example": "Example sentence."
  }
]
Output only the JSON array.`}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Set Title</Label>
            <Input id="title" name="title" required placeholder="e.g. TOEFL Words" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">JSON File</Label>
            <Input id="file" name="file" type="file" accept=".json" required />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
