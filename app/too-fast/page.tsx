import React from 'react'

const TooFast = () => {
  return (
    <main className='root-container flex flex-col min-h-screen items-center justify-center'>
      <h1 className='font-bebas-neue text-5xl font-bold text-light-100'>Too Many requests!!!</h1>
      <p className='mt-3 max-w-xl text-center text-light-400'>You have been blocked. Please try again after some time</p>
    </main>
  )
}

export default TooFast
