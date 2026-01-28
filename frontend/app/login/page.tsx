import { SignIn } from '@clerk/nextjs'
import React from 'react'

function LoginPage() {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <SignIn routing='hash' signUpUrl='/sign-up'/>
    </div>
  )
}

export default LoginPage
