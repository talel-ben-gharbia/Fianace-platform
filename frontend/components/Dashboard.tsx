"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getAllTransactions } from '@/services/transaction.service'
import { ITransactionData, IChartSeriesPoint } from '@/utils/types'
import { Spinner } from './ui/Spinner'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getCHartsOptions } from '@/utils/helpers'
import DashboardStats from './DashboardStats'
import Reached from './Reached'

export default function Dashboard() {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<ITransactionData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = await getToken()
        if (!token) return
        const data = await getAllTransactions(token) as ITransactionData[]
        const normalized = (data || []).map(t => ({ ...t, date: t.date ? new Date(t.date as any) : null }))
        normalized.sort((a,b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
        setTransactions(normalized)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    transactions.forEach(t => {
      const amt = Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0
      if (t.transactionType === 'Expense') expense += amt
      else income += amt
    })
    return { income, expense, balance: income - expense }
  }, [transactions])

  // prepare last 6 months series
  const { seriesData, categories } = useMemo(() => {
    const now = new Date()
    const months: string[] = []
    const monthSums: number[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(d.toLocaleString('en-US', { month: 'short', year: 'numeric' }))
      monthSums.push(0)
    }
    transactions.forEach(t => {
      const dt = t.date ? new Date(t.date as any) : null
      if (!dt) return
      const idx = months.findIndex((m, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        return d.getFullYear() === dt.getFullYear() && d.getMonth() === dt.getMonth()
      })
      if (idx >= 0) {
        const amt = Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0
        monthSums[idx] += amt * (t.transactionType === 'Expense' ? -1 : 1)
      }
    })

    const seriesData: IChartSeriesPoint[] = monthSums.map((v, i) => ({ x: i, y: Math.abs(v), rawDate: new Date(), type: v < 0 ? 'Expense' : 'Income' }))
    return { seriesData, categories: months }
  }, [transactions])

  // category distribution (for pie chart)
  const categoryDistribution = useMemo(() => {
    const map: Record<string, number> = {}
    transactions.forEach(t => {
      const amt = Math.abs(Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0)
      if (!t.category) return
      map[t.category] = (map[t.category] || 0) + amt
    })
    return Object.entries(map).map(([name, y]) => ({ name, y }))
  }, [transactions])

  const highestTransaction = useMemo(() => {
    if (!transactions.length) return null
    let max = transactions[0]
    transactions.forEach(t => {
      const amt = Math.abs(Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0)
      const maxAmt = Math.abs(Number(String(max.amount).replace(/[^0-9.-]+/g, '')) || 0)
      if (amt > maxAmt) max = t
    })
    return max
  }, [transactions])

  // additional stats
  const transactionsCount = transactions.length
  const transactionsThisMonth = useMemo(() => {
    const now = new Date()
    return transactions.filter(t => t.date && new Date(t.date as any).getMonth() === now.getMonth() && new Date(t.date as any).getFullYear() === now.getFullYear()).length
  }, [transactions])

  const avgDailySpendLast30 = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const total = transactions.reduce((acc, t) => {
      const dt = t.date ? new Date(t.date as any) : null
      if (!dt || dt < cutoff) return acc
      if (t.transactionType === 'Expense') return acc + Math.abs(Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0)
      return acc
    }, 0)
    return Math.round(total / 30)
  }, [transactions])

  const incomeExpenseRatio = useMemo(() => {
    if (!totals.income) return null
    return Math.round((totals.expense / totals.income) * 100)
  }, [totals])

  const medianTransaction = useMemo(() => {
    if (!transactions.length) return 0
    const arr = transactions.map(t => Math.abs(Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0)).sort((a,b)=>a-b)
    const mid = Math.floor(arr.length/2)
    return arr.length % 2 === 0 ? Math.round((arr[mid-1]+arr[mid])/2) : Math.round(arr[mid])
  }, [transactions])

  const topCategories = useMemo(() => {
    const map: Record<string, number> = {}
    transactions.forEach(t => {
      if (!t.category) return
      const amt = Math.abs(Number(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0)
      map[t.category] = (map[t.category] || 0) + amt
    })
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,3)
  }, [transactions])

  return (
    <div className="min-h-screen h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Spinner className="h-8 w-8" /></div>
      ) : (
        <>
          <DashboardStats totals={totals} transactions={transactions} highest={highestTransaction} />

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="col-span-1 sm:col-span-1 lg:col-span-1 border rounded-lg p-3">
              <div className="text-xs text-gray-500">Transactions</div>
              <div className="text-lg font-semibold">{transactionsCount}</div>
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-1 border rounded-lg p-3">
              <div className="text-xs text-gray-500">This month</div>
              <div className="text-lg font-semibold">{transactionsThisMonth}</div>
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-1 border rounded-lg p-3">
              <div className="text-xs text-gray-500">Avg daily spend (30d)</div>
              <div className="text-lg font-semibold">${avgDailySpendLast30.toLocaleString()}</div>
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-1 border rounded-lg p-3">
              <div className="text-xs text-gray-500">Income / Expense %</div>
              <div className="text-lg font-semibold">{incomeExpenseRatio !== null ? `${incomeExpenseRatio}%` : '—'}</div>
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-1 border rounded-lg p-3">
              <div className="text-xs text-gray-500">Median Tx</div>
              <div className="text-lg font-semibold">${medianTransaction.toLocaleString()}</div>
            </div>
            <div className="col-span-1 sm:col-span-3 lg:col-span-1 border rounded-lg p-3">
              <div className="text-xs text-gray-500">Top Categories</div>
              <div className="mt-2">
                {topCategories.length ? topCategories.map(([name,amt]) => (
                  <div key={name} className="text-sm">{name} — ${amt.toLocaleString()}</div>
                )) : <div className="text-sm">—</div>}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 border rounded-2xl p-4">
              <div className="font-medium mb-2">Recent Activity (6 months)</div>
              <div>
                <HighchartsReact highcharts={Highcharts} options={getCHartsOptions(categories, seriesData, 'column' as any, 360)} />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">Category Distribution</div>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: { type: 'pie', height: 280, backgroundColor: 'transparent' },
                      title: { text: '' },
                      credits: { enabled: false },
                      tooltip: { pointFormat: '{series.name}: <b>${point.y}</b>' },
                      plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
                      series: [{ type: 'pie', name: 'Amount', data: categoryDistribution } as any]
                    }}
                  />
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">Quick Insights</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Avg transaction</div>
                    <div className="font-medium">${transactions.length ? Math.round((totals.income + totals.expense) / transactions.length) : 0}</div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500">Largest transaction</div>
                    <div className="font-medium">{highestTransaction ? `${highestTransaction.title} — $${Math.abs(Number(String(highestTransaction.amount).replace(/[^0-9.-]+/g,''))).toLocaleString()}` : '—'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-2xl p-4">
              <div className="font-medium mb-2">Milestones</div>
              <Reached transactions={transactions} totals={totals} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
