"use client"
import React from 'react'
import { ITransactionData } from '@/utils/types'

export default function DashboardStats({ totals, transactions, highest } : { totals: { income:number; expense:number; balance:number }, transactions: ITransactionData[], highest?: ITransactionData | null }){
  const count = transactions.length
  const avg = count ? Math.round((totals.income + totals.expense) / count) : 0
  const monthlyAvg = Math.round((totals.income - totals.expense) / Math.max(1, 6))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4">
        <div className="text-sm text-gray-500">Total Income</div>
        <div className="text-xl font-semibold text-emerald-600">${totals.income.toLocaleString()}</div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-sm text-gray-500">Total Expense</div>
        <div className="text-xl font-semibold text-red-600">${totals.expense.toLocaleString()}</div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-sm text-gray-500">Balance</div>
        <div className="text-xl font-semibold">${totals.balance.toLocaleString()}</div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-sm text-gray-500">Avg / Tx</div>
        <div className="text-xl font-semibold">${avg.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">Monthly avg: ${monthlyAvg.toLocaleString()}</div>
      </div>
      {highest ? (
        <div className="col-span-1 sm:col-span-4 border rounded-lg p-4 mt-2">
          <div className="text-sm text-gray-500">Largest Transaction</div>
          <div className="font-medium">{highest.title} — ${Math.abs(Number(String(highest.amount).replace(/[^0-9.-]+/g,''))).toLocaleString()}</div>
        </div>
      ) : null}
    </div>
  )
}
