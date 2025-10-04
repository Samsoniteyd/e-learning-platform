'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { QuizResults } from './quiz-results'

interface QuizInterfaceProps {
  quiz: {
    id: string
    title: string
    duration: number
    questions: Array<{
      id: string
      text: string
      options: string[]
    }>
  }
}

export function QuizInterface({ quiz }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(quiz.duration)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmit()
    }
  }, [timeLeft, isCompleted])

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsCompleted(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isCompleted) {
    return <QuizResults quizId={quiz.id} answers={answers} />
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <Badge variant={timeLeft < 60 ? 'destructive' : 'default'}>
          Time: {formatTime(timeLeft)}
        </Badge>
      </div>

      <Progress value={progress} className="mb-6" />

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{question.text}</p>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[currentQuestion] === index ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-3 px-4 text-left"
                onClick={() => handleAnswer(index)}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button onClick={handleSubmit}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}