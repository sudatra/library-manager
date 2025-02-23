import React from 'react'

const BookOverview = ({
  title, 
  author, 
  genre,
  rating, 
  total_copies, 
  available_copies, 
  description, 
  color, 
  cover
}: BookProps) => {
  return (
    <section className='book-overview'>
      <div className='flex flex-1 flex-col gap-5'>
        <h1>{title}</h1>
      </div>      
    </section>
  )
}

export default BookOverview
