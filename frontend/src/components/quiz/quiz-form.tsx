'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, GripVertical } from 'lucide-react'

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
  correctAnswer: z.number().min(0, 'Correct answer is required'),
})

const quizFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  courseId: z.string().min(1, 'Course is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
})

type QuizFormValues = z.infer<typeof quizFormSchema>

interface QuizFormProps {
  courses: Array<{ id: string; title: string }>
  initialData?: Partial<QuizFormValues>
  isEdit?: boolean
}

export function QuizForm({ courses, initialData, isEdit = false }: QuizFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: initialData || {
      title: '',
      courseId: '',
      duration: 30,
      questions: [
        {
          text: '',
          options: ['', ''],
          correctAnswer: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  async function onSubmit(data: QuizFormValues) {
    setLoading(true)

    try {
      // Submit quiz data
      console.log('Quiz data:', data)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/quizzes')
    } catch (error: any) {
      form.setError('root', {
        message: error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} quiz`
      })
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    append({
      text: '',
      options: ['', ''],
      correctAnswer: 0,
    })
  }

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`)
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, ''])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`)
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, index) => index !== optionIndex)
      form.setValue(`questions.${questionIndex}.options`, newOptions)
      
      // Adjust correct answer if needed
      const currentCorrect = form.getValues(`questions.${questionIndex}.correctAnswer`)
      if (currentCorrect === optionIndex) {
        form.setValue(`questions.${questionIndex}.correctAnswer`, 0)
      } else if (currentCorrect > optionIndex) {
        form.setValue(`questions.${questionIndex}.correctAnswer`, currentCorrect - 1)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chapter 1 Assessment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Time limit for completing the quiz
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Questions</h3>
            <Button type="button" onClick={addQuestion} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {fields.map((field, questionIndex) => (
            <Card key={field.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    Question {questionIndex + 1}
                  </CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(questionIndex)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the question..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Options</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(questionIndex)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  {form.watch(`questions.${questionIndex}.options`).map((_, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.options.${optionIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Option ${optionIndex + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch(`questions.${questionIndex}.options`).length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.correctAnswer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.watch(`questions.${questionIndex}.options`).map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              Option {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </Form>
  )
}