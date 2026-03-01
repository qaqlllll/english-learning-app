'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Word } from '@/types'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { shuffleArray } from '@/lib/utils'

interface QuizSessionProps {
  words: Word[]
  setId: string
}

interface Question {
  target: Word
  options: Word[]
}

export function QuizSession({ words, setId }: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [mode, setMode] = useState<'en' | 'zh'>('en')

  useEffect(() => {
    if (!words || words.length < 4) return

    // Generate all questions
    const generatedQuestions = words.map((targetWord) => {
      // Generate 3 distractors
      const distractors = words
        .filter(w => w.id !== targetWord.id)
      
      const shuffledDistractors = shuffleArray(distractors).slice(0, 3)
      
      const options = shuffleArray([targetWord, ...shuffledDistractors])
      
      return {
        target: targetWord,
        options
      }
    })

    // Shuffle questions order
    const shuffledQuestions = shuffleArray(generatedQuestions)
    
    setQuestions(shuffledQuestions)
  }, [words])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (wordId: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(wordId)
    setIsAnswered(true)
    
    if (wordId === currentQuestion?.target.id) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setShowResult(false)
    // Optionally reshuffle questions
    const reshuffled = shuffleArray(questions)
    setQuestions(reshuffled)
  }

  if (!words || words.length < 4) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Not enough words for a quiz. You need at least 4 words.</p>
        <Link href={`/learn/${setId}`}>
          <Button variant="outline">Back to Study Hub</Button>
        </Link>
      </div>
    )
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold mb-4 text-primary">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-xl text-gray-600 mb-8">
            You got {score} out of {questions.length} correct.
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

  if (!currentQuestion) return <div>Loading...</div>

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
        <div className="flex gap-4 items-center">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMode(mode === 'en' ? 'zh' : 'en')}
            className="text-xs border"
          >
            Mode: {mode === 'en' ? 'English Def' : 'Chinese Def'}
          </Button>
        </div>
        <span>Score: {score}</span>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-medium mb-2 text-gray-500">
            {mode === 'zh' ? 'Chinese Definition:' : 'Definition:'}
          </h2>
          <p className="text-2xl font-bold">
            {mode === 'zh' 
              ? (currentQuestion.target.definition_zh || currentQuestion.target.definition) 
              : currentQuestion.target.definition
            }
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option.id
          const isCorrect = option.id === currentQuestion.target.id
          
          // Force styling for clarity
          let buttonClass = "h-16 text-lg justify-start px-6 relative"
          if (isAnswered && isCorrect) buttonClass += " bg-green-100 border-green-500 text-green-700 hover:bg-green-100"
          if (isAnswered && isSelected && !isCorrect) buttonClass += " bg-red-100 border-red-500 text-red-700 hover:bg-red-100"

          return (
            <Button
              key={option.id}
              variant="outline"
              className={buttonClass}
              onClick={() => handleAnswer(option.id)}
              disabled={isAnswered}
            >
              {option.word}
              {isAnswered && isCorrect && <CheckCircle className="ml-auto w-5 h-5 text-green-600" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto w-5 h-5 text-red-600" />}
            </Button>
          )
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-4">
          <Button size="lg" onClick={handleNext}>
            Next Question
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
