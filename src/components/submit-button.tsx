"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  pendingText?: string
}

export function SubmitButton({ 
  children, 
  pendingText, 
  disabled, 
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button disabled={disabled || pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
