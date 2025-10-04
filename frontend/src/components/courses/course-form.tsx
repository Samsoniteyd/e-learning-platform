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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
})

type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormProps {
  initialData?: Partial<CourseFormValues>
  isEdit?: boolean
  onSubmit?: (data: CourseFormValues) => Promise<void>
}

export function CourseForm({ initialData, isEdit = false, onSubmit }: CourseFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      duration: initialData?.duration || 60,
      level: initialData?.level || 'BEGINNER',
      imageUrl: initialData?.imageUrl || '',
      category: initialData?.category || '',
    },
  })

  async function handleSubmit(data: CourseFormValues) {
    setLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        console.log('Course data:', data)
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/courses')
      }
    } catch (error: any) {
      form.setError('root', {
        message: error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} course`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Nursing Fundamentals" {...field} />
              </FormControl>
              <FormDescription>
                A clear and descriptive title for your course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn in this course..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a comprehensive overview of the course content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                      field.onChange(isNaN(value) ? 0 : value)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Set 0 for free courses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 60 : parseInt(e.target.value, 10)
                      field.onChange(isNaN(value) ? 60 : value)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Total course duration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fundamentals">Nursing Fundamentals</SelectItem>
                    <SelectItem value="anatomy">Anatomy & Physiology</SelectItem>
                    <SelectItem value="pharmacology">Pharmacology</SelectItem>
                    <SelectItem value="clinical">Clinical Skills</SelectItem>
                    <SelectItem value="pediatrics">Pediatric Nursing</SelectItem>
                    <SelectItem value="critical-care">Critical Care</SelectItem>
                    <SelectItem value="mental-health">Mental Health Nursing</SelectItem>
                    <SelectItem value="community">Community Health</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Primary category for the course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Optional: URL for course thumbnail
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Form>
  )
}