'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Word } from '@/types'
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { shuffleArray } from '@/lib/utils'
import { SpeakButton } from '@/components/speak-button'

interface SpellingSessionProps {
  words: Word[]
  setId: string
}

export function SpellingSession({ words, setId }: SpellingSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
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

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word.toLowerCase()
    
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setIsAnswered(true)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < shuffledWords.length) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setIsAnswered(false)
      setFeedback(null)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setUserAnswer('')
    setIsAnswered(false)
    setShowResult(false)
    setFeedback(null)
    setShuffledWords(shuffleArray(words))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isAnswered) {
        handleNext()
      } else {
        checkAnswer()
      }
    }
  }

  if (!words || words.length === 0) {
    return <div className="text-center py-12">No words found in this set.</div>
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Spelling Practice Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold mb-4 text-primary">
            {Math.round((score / shuffledWords.length) * 100)}%
          </div>
          <p className="text-xl text-gray-600 mb-8">
            You spelled {score} out of {shuffledWords.length} words correctly.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={handleRestart} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href={`/learn/${setId}`}>
            <Button>Back to Hub</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
        <span>Word {currentIndex + 1} of {shuffledWords.length}</span>
        <span>Score: {score}</span>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-8 text-center space-y-6">
          <div>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Definition</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-2xl font-medium">{currentWord.definition}</p>
              <SpeakButton text={currentWord.word} />
            </div>
            {currentWord.definition_zh && (
              <p className="text-lg text-gray-500 font-normal">{currentWord.definition_zh}</p>
            )}
          </div>

          <div className="relative max-w-sm mx-auto">
            <Input
              type="text"
              placeholder="Type the word..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAnswered}
              className={`text-center text-xl h-14 ${
                feedback === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 
                feedback === 'incorrect' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : ''
              }`}
              autoFocus
            />
            {feedback === 'correct' && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-6 h-6" />
            )}
            {feedback === 'incorrect' && (
              <X className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 dark:text-red-400 w-6 h-6" />
            )}
          </div>

          {feedback === 'incorrect' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-gray-500 mb-1">Correct answer:</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{currentWord.word}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center pb-8">
          {!isAnswered ? (
            <Button size="lg" onClick={checkAnswer} disabled={!userAnswer.trim()}>
              Check Answer
            </Button>
          ) : (
            <Button size="lg" onClick={handleNext}>
              Next Word
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
