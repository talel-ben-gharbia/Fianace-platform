import { SignUp } from '@clerk/nextjs'
import React from 'react'

function SignUpPage() {
  return (
    <div className='flex items-center justify-center w-full min-h-screen'>
        <SignUp routing='hash' signInUrl='/login'/>
    </div>
  )
}

export default SignUpPage
