'use client'

import { useState, useEffect } from 'react'
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

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  specialization: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface UpdateProfileFormProps {
  user: User
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: '',
      specialization: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        bio: '',
        specialization: '',
      })
    }
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)

    try {
      // Update profile API call would go here
      console.log('Updating profile:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      form.setError('root', {
        type: 'success',
        message: 'Profile updated successfully!'
      })
    } catch (error: any) {
      form.setError('root', {
        message: error.response?.data?.error || 'Failed to update profile'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className={`text-sm p-3 rounded-md ${
            form.formState.errors.root.type === 'success' 
              ? 'bg-green-500/15 text-green-700' 
              : 'bg-destructive/15 text-destructive'
          }`}>
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your nursing specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Nursing</SelectItem>
                  <SelectItem value="pediatric">Pediatric Nursing</SelectItem>
                  <SelectItem value="critical">Critical Care Nursing</SelectItem>
                  <SelectItem value="emergency">Emergency Nursing</SelectItem>
                  <SelectItem value="surgical">Surgical Nursing</SelectItem>
                  <SelectItem value="psychiatric">Psychiatric Nursing</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your primary area of nursing interest
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself and your nursing background..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Share your nursing experience and goals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Updating Profile...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}