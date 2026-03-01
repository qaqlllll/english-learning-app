'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, FileText } from "lucide-react"
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
  const [mode, setMode] = useState<'file' | 'text'>('file')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      
      // If in text mode, create a File object from the text content
      if (mode === 'text') {
        const jsonContent = formData.get('jsonContent') as string
        if (!jsonContent) throw new Error('Please enter JSON content')
        
        try {
          // Validate JSON first
          JSON.parse(jsonContent)
        } catch (e) {
          throw new Error('Invalid JSON format. Please check your input.')
        }

        const file = new File([jsonContent], 'import.json', { type: 'application/json' })
        formData.set('file', file)
        formData.delete('jsonContent') // Clean up
      }

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
      <DialogContent className="sm:max-w-[600px]">
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

        <div className="flex gap-2 mb-4">
          <Button 
            type="button" 
            variant={mode === 'file' ? 'default' : 'outline'} 
            onClick={() => setMode('file')}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button 
            type="button" 
            variant={mode === 'text' ? 'default' : 'outline'} 
            onClick={() => setMode('text')}
            className="flex-1"
          >
            <FileText className="mr-2 h-4 w-4" />
            Paste JSON
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Set Title</Label>
            <Input id="title" name="title" required placeholder="e.g. TOEFL Words" />
          </div>

          {mode === 'file' ? (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">JSON File</Label>
              <Input id="file" name="file" type="file" accept=".json" required />
            </div>
          ) : (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="jsonContent">JSON Content</Label>
              <Textarea 
                id="jsonContent" 
                name="jsonContent" 
                required 
                placeholder='[{"word": "example", "definition": "..."}]'
                className="font-mono text-xs h-[200px]"
              />
            </div>
          )}
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
