'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { borrowBook } from '@/lib/actions/book.actions';

interface Props {
  userId: string;
  bookId: string;
  borrowEligibility: { isEligible: boolean, message: string }
}

const BorrowBookButton = ({ bookId, userId, borrowEligibility: { isEligible, message } }: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState<boolean>(false);

  const handleBorrow = async () => {
    if(!isEligible) {
      toast(message);
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId });
      if(result.success) {
        toast('Book borrowed successfully');
        router.push('/my-profile')
      }
    }
    catch(error) {
      toast('Error Occurred while borrowing book');
    }
    finally {
      setBorrowing(false);
    }
  }

  return (
    <Button 
      className='book-overview_btn'
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image 
        src='/icons/book.svg'
        alt='book'
        width={20}
        height={20}
      />

      <p className='font-bebas-neue text-xl text-dark-100'>
        {
          borrowing ? 'Borrowing...' : 'Borrow Book'
        }
      </p>
    </Button>
  )
}

export default BorrowBookButton
