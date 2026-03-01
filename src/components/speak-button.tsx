"use client"

import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SpeakButtonProps {
  text: string
  lang?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SpeakButton({ 
  text, 
  lang = "en-US", 
  className,
  variant = "ghost",
  size = "icon"
}: SpeakButtonProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering card flip or other parent clicks
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={handleSpeak}
      title="Listen to pronunciation"
    >
      <Volume2 className="h-5 w-5" />
      <span className="sr-only">Listen</span>
    </Button>
  )
}
