import { signOut } from '@/auth';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/button'
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { desc } from 'drizzle-orm';
import React from 'react'

const Profile = async () => {
  return (
    <>
      <form 
        action={async () => {
          'use server';
          await signOut();
        }}
        className='mb-10 absolute right-10 top-10'
      >
        <Button>Logout</Button>
      </form>
    </>
  )
}

export default Profile
