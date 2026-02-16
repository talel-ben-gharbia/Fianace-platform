"use client"
import React from 'react'
import { ITransactionData } from '@/utils/types'

export default function Reached({ transactions, totals } : { transactions: ITransactionData[], totals: { income:number; expense:number; balance:number } }){
  // compute top category
  const categoryMap: Record<string, number> = {}
  transactions.forEach(t => {
    const amt = Math.abs(Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0)
    if (!t.category) return
    categoryMap[t.category] = (categoryMap[t.category] || 0) + amt
  })
  const topCategory = Object.entries(categoryMap).sort((a,b)=>b[1]-a[1])[0]

  // simple goals: example goal reached when savings > 1000
  const savings = totals.balance
  const goal = 1000
  const progress = Math.min(100, Math.round((savings / goal) * 100))

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 border rounded-md">
        <div className="text-sm text-gray-500">Savings Progress</div>
        <div className="font-medium">${savings.toLocaleString()}</div>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
          <div style={{ width: `${progress}%` }} className="h-2 bg-emerald-500" />
        </div>
        <div className="text-xs text-gray-500 mt-1">{progress}% of ${goal.toLocaleString()}</div>
      </div>

      <div className="p-3 border rounded-md">
        <div className="text-sm text-gray-500">Top Category</div>
        <div className="font-medium">{topCategory ? `${topCategory[0]} — $${topCategory[1].toLocaleString()}` : '—'}</div>
      </div>

      <div className="p-3 border rounded-md">
        <div className="text-sm text-gray-500">Transactions</div>
        <div className="font-medium">{transactions.length}</div>
      </div>
    </div>
  )
}
