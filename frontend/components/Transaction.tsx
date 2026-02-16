"use client"
import React, { useEffect, useState } from 'react'
import TransactionModal from './TransactionModal'
import { ITransactionData, IChartSeriesPoint } from '@/utils/types';
import { useAuth } from '@clerk/nextjs';
import { addIncome, updateIncome, deleteIncome } from '@/services/income.services';
import { addExpense, updateExpense, deleteExpense } from '@/services/expense.services';
import { getAllTransactions } from '@/services/transaction.service';
import { Spinner } from './ui/Spinner';
import { SquarePen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchTransactionsList, getCHartsOptions } from '@/utils/helpers';

function Transaction() {
    const { getToken } = useAuth();
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionObj, setTransactionObj] = useState<ITransactionData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<ITransactionData[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // chart data
    const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [chartType, setChartType] = useState<'column' | 'line'>('column');

    const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

    // ensure page remains valid when data or page size changes
    React.useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const visibleTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) return;
            const combinedResp = await getAllTransactions(token) as ITransactionData[];
            const combined = (combinedResp || []).map(t => ({ ...t, date: t.date ? new Date(t.date as any) : null }));
            combined.sort((a,b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

            // prepare chart data
            const { newSeriesData, newCategories } = fetchTransactionsList(combined as ITransactionData[]);
            setSeriesData(newSeriesData);
            setCategories(newCategories);

            // debug: log chart data so we can see why it might be empty
            console.log('Transaction chart data', { newSeriesData, newCategories, combinedLength: combined.length });

            setTransactions(combined);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddTransaction = async (data: ITransactionData) => {
        try {
            const token = await getToken();
            if (!token) { toast.error('User not authenticated'); return; }
            if (data.transactionType === 'Expense') {
                await addExpense(data, token);
                toast.success('Expense added');
            } else {
                await addIncome(data, token);
                toast.success('Income added');
            }
            await fetchTransactions();
        } catch (error) {
            console.log(error);
            toast.error('Failed to add transaction');
        }
    }

    const handleUpdateTransaction = async (data: ITransactionData) => {
        try {
            const token = await getToken();
            if (!token) { toast.error('User not authenticated'); return; }
            if (!data._id) { toast.error('Missing id'); return; }
            if (data.transactionType === 'Expense') {
                await updateExpense(data, data._id, token);
                toast.success('Expense updated');
            } else {
                await updateIncome(data, data._id, token);
                toast.success('Income updated');
            }
            await fetchTransactions();
        } catch (error) {
            console.log(error);
            toast.error('Failed to update transaction');
        }
    }

    const handleDelete = async (t: ITransactionData) => {
        const confirm = window.confirm('Are you sure you want to delete this transaction?');
        if (!confirm) return;
        try {
            const token = await getToken();
            if (!token) { toast.error('User not authenticated'); return; }
            if (!t._id) { toast.error('Missing id'); return; }
            if (t.transactionType === 'Expense') {
                await deleteExpense(t._id, token);
                toast.success('Expense deleted');
            } else {
                await deleteIncome(t._id, token);
                toast.success('Income deleted');
            }
            await fetchTransactions();
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete transaction');
        }
    }

  return (
    <div className='w-full mt-6 px-8 min-h-screen h-full'>
        <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium">Transactions</h1>
        <TransactionModal
        onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          showTransactionModal={showTransactionModal}
          setShowTransactionModal={setShowTransactionModal}
          transactionObj={transactionObj}
          setIsEditMode={setIsEditMode}
          isEditMode={isEditMode}
        />
      </div>

      <div className="mt-6 border rounded-2xl p-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner className="h-8 w-8" />
          </div>
        ) : transactions.length ? (
          <div className="overflow-x-auto">
            {/* Chart overview with toggle */}
            <div className="border border-gray-300 mt-4 px-3 py-6 rounded-3xl flex-1 relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-lg">Transaction Overview</div>
                  <div className="text-sm text-gray-500">Monitor your transactions over time and gain insights into your income and expenses.</div>
                </div>
                <div>
                  <button
                    className="bg-black text-white rounded-md px-3 py-1 text-sm"
                    onClick={() => setChartType((c) => (c === 'line' ? 'column' : 'line'))}
                  >
                    {chartType === 'line' ? 'Column' : 'Line'}
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <HighchartsReact highcharts={Highcharts} options={getCHartsOptions(categories, seriesData, chartType as any)} />
              </div>
            </div>

            {/* Controls: page size and pagination */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Rows per page</span>
                <select
                  aria-label="Rows per page"
                  className="border rounded-md px-2 py-1 text-sm"
                  value={String(pageSize)}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">Showing {Math.min((page - 1) * pageSize + 1, transactions.length)} - {Math.min(page * pageSize, transactions.length)} of {transactions.length}</div>
            </div>

            <div className="border rounded-lg">
              <div className="overflow-x-auto">
                <div className="max-h-80 overflow-y-auto no-scrollbar">
                  <table className="w-full text-left table-fixed">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="text-sm text-gray-500 border-b">
                        <th className="py-3 w-2/5">Item</th>
                        <th className="py-3 w-1/6">Category</th>
                        <th className="py-3 w-1/6">Type</th>
                        <th className="py-3 w-1/6">Amount</th>
                        <th className="py-3 w-24">Date</th>
                        <th className="py-3 w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTransactions.map((t, idx) => (
                        <tr key={t._id} className={`border-b last:border-0 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                          <td className="py-4 w-2/5">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl bg-white shadow-sm rounded-full w-10 h-10 flex items-center justify-center">{t.emoji}</span>
                              <div>
                                <div className="font-medium">{t.title}</div>
                                <div className="text-xs text-gray-400">{t._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 w-1/6">
                            <span className="inline-flex items-center bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">{t.category}</span>
                          </td>
                          <td className="py-4 w-1/6">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${t.transactionType === 'Expense' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {t.transactionType}
                            </span>
                          </td>
                          <td className="py-4 w-1/6">
                            <div className={`inline-flex items-center rounded-md px-3 py-1 font-semibold ${t.transactionType === 'Expense' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {t.transactionType === 'Expense' ? `- $${Number(t.amount).toLocaleString()}` : `+ $${Number(t.amount).toLocaleString()}`}
                            </div>
                          </td>
                          <td className="py-4 w-24 text-sm text-gray-500">{t.date ? new Date(t.date).toLocaleDateString() : ''}</td>
                          <td className="py-4 w-24">
                            <div className="flex items-center gap-3">
                              <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => { setIsEditMode(true); setShowTransactionModal(true); setTransactionObj(t); }}>
                                <SquarePen className="w-5 h-5 text-gray-600" />
                              </button>
                              <button className="p-2 rounded-md hover:bg-red-50" onClick={() => handleDelete(t)}>
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-md border" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                <button className="px-3 py-1 rounded-md border" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500">No transactions yet. Click Add Transaction to start.</div>
        )}
      </div>
    </div>  
  )
}

export default Transaction
