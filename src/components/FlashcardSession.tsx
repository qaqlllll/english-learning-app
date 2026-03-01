'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { Word } from '@/types'
import { shuffleArray } from '@/lib/utils'
import { SpeakButton } from '@/components/speak-button'

interface FlashcardSessionProps {
  words: Word[]
}

export function FlashcardSession({ words }: FlashcardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showChinese, setShowChinese] = useState(false)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])

  useEffect(() => {
    if (words && words.length > 0) {
      setShuffledWords(shuffleArray(words))
    }
  }, [words])

  if (!shuffledWords || shuffledWords.length === 0) {
    if (!words || words.length === 0) {
      return <div className="text-center py-12">No words found in this set.</div>
    }
    return <div className="text-center py-12">Loading...</div>
  }

  const currentWord = shuffledWords[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
      <div className="w-full text-center mb-4 text-gray-500">
        Card {currentIndex + 1} of {shuffledWords.length}
      </div>

      <div 
        className="relative w-full aspect-[3/2] [perspective:1000px] cursor-pointer group"
        onClick={handleFlip}
      >
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
            <Card className="w-full h-full flex items-center justify-center bg-card dark:bg-card shadow-xl border-2">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full relative w-full">
                <div className="absolute top-4 right-4 z-10">
                  <SpeakButton text={currentWord.word} />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-card-foreground">{currentWord.word}</h2>
                <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
              </CardContent>
            </Card>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <Card className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-zinc-900 shadow-xl border-2">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full text-center relative w-full">
                <div className="absolute top-4 right-4 z-10">
                  <SpeakButton text={currentWord.word} />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-foreground">{currentWord.definition}</h3>
                {showChinese && currentWord.definition_zh && (
                  <p className="text-lg text-muted-foreground mb-4 font-medium">{currentWord.definition_zh}</p>
                )}
                {currentWord.example && (
                  <p className="text-lg text-muted-foreground italic">&quot;{currentWord.example}&quot;</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <Button variant="outline" size="lg" onClick={handlePrev}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button variant="outline" size="lg" onClick={handleFlip}>
          <RotateCw className="w-4 h-4 mr-2" />
          Flip
        </Button>
        <Button 
          variant={showChinese ? "default" : "outline"} 
          size="lg" 
          onClick={() => setShowChinese(!showChinese)}
        >
          {showChinese ? "Hide ZH" : "Show ZH"}
        </Button>
        <Button variant="default" size="lg" onClick={handleNext}>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
