'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { coursesApi } from '@/lib/api'

const enrollSchema = z.object({
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  goals: z.string().min(10, 'Please describe your learning goals (at least 10 characters)'),
})

type EnrollFormValues = z.infer<typeof enrollSchema>

interface EnrollFormProps {
  courseId: string
  courseTitle: string
}

export function EnrollForm({ courseId, courseTitle }: EnrollFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      experienceLevel: '',
      goals: '',
    },
  })

  async function onSubmit(data: EnrollFormValues) {
    setLoading(true)

    try {
      await coursesApi.enroll(courseId)
      router.push(`/courses/${courseId}`)
    } catch (error: any) {
      form.setError('root', {
        message: error.response?.data?.error || 'Failed to enroll in course'
      })
    } finally {
      setLoading(false)
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

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This helps us personalize your learning experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you hope to achieve from this course?"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell us about your specific learning objectives
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enrolling...' : `Enroll in ${courseTitle}`}
        </Button>
      </form>
    </Form>
  )
}