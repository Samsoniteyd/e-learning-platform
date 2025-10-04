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

// Fix: Use z.number() instead of z.coerce.number() and transform the input
const moduleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  order: z.number().min(1, 'Order must be at least 1'),
  videoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  resources: z.string().optional(),
})

type ModuleFormValues = z.infer<typeof moduleSchema>

interface ModuleFormProps {
  courseId: string
  initialData?: Partial<ModuleFormValues>
  isEdit?: boolean
  nextOrder?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function ModuleForm({ 
  courseId, 
  initialData, 
  isEdit = false, 
  nextOrder = 1,
  onSuccess,
  onCancel 
}: ModuleFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      order: initialData?.order || nextOrder,
      videoUrl: initialData?.videoUrl || '',
      resources: initialData?.resources || '',
    },
  })

  async function onSubmit(data: ModuleFormValues) {
    setLoading(true)

    try {
      // Submit module data - replace with actual API call
      console.log('Module data:', { ...data, courseId })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Call success callback if provided, otherwise navigate
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/courses/${courseId}`)
      }
    } catch (error: any) {
      form.setError('root', {
        message: error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} module`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (onSuccess) {
      onSuccess()
    } else {
      router.back()
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
                <FormLabel>Module Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Introduction to Nursing" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={(e) => {
                      // Convert string to number manually
                      const value = e.target.value === '' ? 1 : parseInt(e.target.value, 10)
                      field.onChange(isNaN(value) ? 1 : value)
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  Position in the course sequence
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the learning content for this module..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed content that students will learn in this module
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://youtube.com/embed/..." 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Link to supplementary video content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resources"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Resources (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any additional resources, references, or reading materials..."
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Supplementary materials for further learning
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Module' : 'Create Module'}
          </Button>
        </div>
      </form>
    </Form>
  )
}