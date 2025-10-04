'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

const searchFilterSchema = z.object({
  search: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  duration: z.string().optional(),
})

type SearchFilterValues = z.infer<typeof searchFilterSchema>

interface SearchFilterFormProps {
  onFilter: (filters: SearchFilterValues) => void
  initialFilters?: SearchFilterValues
}

export function SearchFilterForm({ onFilter, initialFilters }: SearchFilterFormProps) {
  const [showFilters, setShowFilters] = useState(false)

  const form = useForm<SearchFilterValues>({
    resolver: zodResolver(searchFilterSchema),
    defaultValues: initialFilters || {
      search: '',
      level: '',
      category: '',
      priceRange: [0, 100],
      duration: '',
    },
  })

  function onSubmit(data: SearchFilterValues) {
    onFilter(data)
  }

  function handleReset() {
    form.reset({
      search: '',
      level: '',
      category: '',
      priceRange: [0, 100],
      duration: '',
    })
    onFilter({
      search: '',
      level: '',
      category: '',
      priceRange: [0, 100],
      duration: '',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="fundamentals">Nursing Fundamentals</SelectItem>
                      <SelectItem value="anatomy">Anatomy & Physiology</SelectItem>
                      <SelectItem value="pharmacology">Pharmacology</SelectItem>
                      <SelectItem value="clinical">Clinical Skills</SelectItem>
                      <SelectItem value="pediatrics">Pediatric Nursing</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Any Duration</SelectItem>
                      <SelectItem value="short">Short (&lt; 1 hour)</SelectItem>
                      <SelectItem value="medium">Medium (1-3 hours)</SelectItem>
                      <SelectItem value="long">Long (&gt; 3 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        value={field.value}
                        onValueChange={field.onChange}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${field.value?.[0] || 0}</span>
                        <span>${field.value?.[1] || 100}</span>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 col-span-full">
              <Button type="submit" size="sm">
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <X className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}