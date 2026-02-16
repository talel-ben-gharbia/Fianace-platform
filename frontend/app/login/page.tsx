import { SignIn } from '@clerk/nextjs'
import React from 'react'

function LoginPage() {
  return (
    <div className='flex items-center justify-center w-full min-h-screen'>
      <SignIn routing='hash' signUpUrl='/sign-up'/>
    </div>
  )
}

export default LoginPage
