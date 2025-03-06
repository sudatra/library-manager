'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { bookSchema } from '@/lib/validations'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import ColorPicker from '../ColorPicker'
import { createBook } from '@/lib/actions/admin/actions/book.actions'
import { toast } from 'sonner'

interface Props extends Partial<Book> {
  type?: 'create' | 'update'
}

const BookForm = ({ type, ...book }: Props) => {
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      rating: 1,
      totalCopies: 1,
      description: '',
      coverUrl: '',
      coverColor: '',
      videoUrl: '',
      summary: ''
    }
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = await createBook(values);

    if(result.success === true) {
      toast('Book created successfully');
      router.push(`/admin/books/${result.data.id}`);
    }
    else {
      toast('Unable to create book')
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Book Title</FormLabel>
              <FormControl>
                <Input 
                  className='book-form_input'
                  placeholder='Book title'
                  required 
                  {...field} 
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='author'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Author</FormLabel>
              <FormControl>
                <Input 
                  className='book-form_input'
                  placeholder='Book author'
                  required 
                  {...field} 
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='genre'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Genre</FormLabel>
              <FormControl>
                <Input 
                  className='book-form_input'
                  placeholder='Book genre'
                  required 
                  {...field} 
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Rating</FormLabel>
              <FormControl>
                <Input 
                  className='book-form_input'
                  placeholder='Book rating'
                  required 
                  {...field} 
                  type='number'
                  min={1}
                  max={5}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='totalCopies'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Total Copies</FormLabel>
              <FormControl>
                <Input 
                  className='book-form_input'
                  placeholder='Total copies'
                  required 
                  {...field} 
                  type='number'
                  min={1}
                  max={10000}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='coverUrl'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Book Image</FormLabel>
              <FormControl>
                <FileUpload 
                  type='image'
                  accept='image/*'
                  placeholder='Upload cover url'
                  folder='book/covers'
                  variant='light'
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='coverColor'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Primary Color</FormLabel>
              <FormControl>
                <ColorPicker 
                  onPickerChange={field.onChange}
                  value={field.value}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Book Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='Book description'
                  {...field}
                  rows={10}
                  className='book-form_input'
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='videoUrl'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Book Video</FormLabel>
              <FormControl>
                <FileUpload 
                    type='video'
                    accept='video/*'
                    placeholder='Upload book video'
                    folder='book/videos'
                    variant='light'
                    onFileChange={field.onChange}
                    value={field.value}
                  />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='summary'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>Book Summary</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='Book summary'
                  {...field}
                  rows={5}
                  className='book-form_input'
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='book-form_btn text-light-100'
        >
          Add Book to Library
        </Button>
      </form>
    </Form>
  )
}

export default BookForm
