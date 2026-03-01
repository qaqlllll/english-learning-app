'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Word } from '@/types'
import { ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { shuffleArray } from '@/lib/utils'

interface SentenceSessionProps {
  words: Word[]
  setId: string
}

export function SentenceSession({ words, setId }: SentenceSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [builtSentenceObjs, setBuiltSentenceObjs] = useState<{ id: string, word: string }[]>([])
  const [availableWords, setAvailableWords] = useState<{ id: string, word: string }[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])

  // Shuffle words initially
  useEffect(() => {
    if (words && words.length > 0) {
      setShuffledWords(shuffleArray(words))
    }
  }, [words])

  // Filter words that have examples from the shuffled list
  const validWords = useMemo(() => shuffledWords.filter(w => w.example && w.example.trim().length > 0), [shuffledWords])

  const currentWord = validWords[currentIndex]
  
  // Initialize available words when currentWord changes
  useEffect(() => {
    if (!currentWord) return

    // Clean the example sentence and split
    const tokens = currentWord.example.trim().split(/\s+/)
    
    // Create objects with unique IDs to handle duplicate words
    const wordObjects = tokens.map((w, i) => ({ id: `${i}-${w}`, word: w }))
    
    // Shuffle the sentence tokens
    const shuffled = shuffleArray(wordObjects)
    
    setAvailableWords(shuffled)
    setBuiltSentenceObjs([])
    setIsAnswered(false)
    setFeedback(null)
  }, [currentWord]) 

  const handleWordClickObj = (wordObj: { id: string, word: string }) => {
    if (isAnswered) return
    setBuiltSentenceObjs(prev => [...prev, wordObj])
    setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id))
  }

  const handleRemoveWordObj = (wordObj: { id: string, word: string }) => {
    if (isAnswered) return
    setAvailableWords(prev => [...prev, wordObj])
    setBuiltSentenceObjs(prev => prev.filter(w => w.id !== wordObj.id))
  }

  const checkAnswer = () => {
    const userSentence = builtSentenceObjs.map(w => w.word).join(' ')
    const originalSentence = currentWord.example
    
    const isCorrect = userSentence === originalSentence
    
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setIsAnswered(true)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < validWords.length) {
      setCurrentIndex(prev => prev + 1)
      setBuiltSentenceObjs([])
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setBuiltSentenceObjs([])
    setShowResult(false)
    setShuffledWords(shuffleArray(words))
  }

  if (!shuffledWords || shuffledWords.length === 0) {
    if (!words || words.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="mb-4">No words found in this set.</p>
          <Link href={`/learn/${setId}`}>
            <Button variant="outline">Back to Study Hub</Button>
          </Link>
        </div>
      )
    }
    return <div className="text-center py-12">Loading...</div>
  }

  if (validWords.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">No words with examples found in this set.</p>
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
          <CardTitle className="text-3xl">Sentence Building Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold mb-4 text-primary">
            {Math.round((score / validWords.length) * 100)}%
          </div>
          <p className="text-xl text-gray-600 mb-8">
            You built {score} out of {validWords.length} sentences correctly.
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

  if (!currentWord) return <div>Loading...</div>

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
        <span>Sentence {currentIndex + 1} of {validWords.length}</span>
        <span>Score: {score}</span>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold mb-2">{currentWord.word}</CardTitle>
          <p className="text-center text-gray-500">{currentWord.definition}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Built Sentence Area */}
          <div className={`min-h-[80px] p-4 rounded-lg border-2 border-dashed flex flex-wrap gap-2 items-center justify-center transition-colors ${
            feedback === 'correct' ? 'border-green-500 bg-green-50' : 
            feedback === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}>
            {builtSentenceObjs.length === 0 && !isAnswered && (
              <span className="text-gray-400">Click words below to build the sentence</span>
            )}
            
            {builtSentenceObjs.map((obj) => (
              <Button
                key={obj.id}
                variant="secondary"
                size="sm"
                onClick={() => handleRemoveWordObj(obj)}
                disabled={isAnswered}
                className="animate-in zoom-in duration-200"
              >
                {obj.word}
              </Button>
            ))}
          </div>

          {/* Feedback */}
          {feedback === 'incorrect' && (
             <div className="text-center animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-gray-500 mb-1">Correct sentence:</p>
              <p className="text-lg font-medium text-green-600">{currentWord.example}</p>
            </div>
          )}

          {/* Available Words */}
          <div className="flex flex-wrap gap-2 justify-center">
            {availableWords.map((obj) => (
              <Button
                key={obj.id}
                variant="outline"
                onClick={() => handleWordClickObj(obj)}
                disabled={isAnswered}
                className="hover:bg-primary/10 transition-colors"
              >
                {obj.word}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center pb-8">
           {!isAnswered ? (
            <Button size="lg" onClick={checkAnswer} disabled={builtSentenceObjs.length === 0}>
              Check Answer
            </Button>
          ) : (
            <Button size="lg" onClick={handleNext}>
              Next Sentence
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
