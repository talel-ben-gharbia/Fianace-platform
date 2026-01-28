import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/Modal'
import { Button } from './ui/Button'

function IncomeModal() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button className='cursor-pointer'>Add income</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Income</DialogTitle>
                <DialogDescription>Add income to the list in just a few simple steps </DialogDescription>
            </DialogHeader>

            <div className='flex flex-col items-center justify-center gap-4'>
                <div>
                    <span className='text-4xl border border-gray-300 py-1 px-2 rounded-md cursor-pointer'>✨</span>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default IncomeModal
