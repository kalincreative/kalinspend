import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

/* ── Icon components ── */
function WalletIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round"
      className={className}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="round"
      className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round"
      className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="round"
      className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DownloadIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round"
      className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function TrendingUpIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round"
      className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}


function App() {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("General")
  const [type, setType] = useState("expense") // 'income' or 'expense'

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("vibe_finance_data")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("vibe_finance_data", JSON.stringify(entries))
  }, [entries])

  const handleAddEntry = (e) => {
    e?.preventDefault()
    if (!title || !amount) return
    const newEntry = {
      id: crypto.randomUUID(),
      title,
      amount: parseFloat(amount),
      category,
      type,
      completed: false,
      date: new Date().toLocaleDateString('en-GB')
    }
    setEntries([newEntry, ...entries])
    setTitle("")
    setAmount("")
  }

  const handleDelete = (id) => {
    setEntries(entries.filter(item => item.id !== id))
  }

  const totalIncome = entries.filter(e => e.type === 'income').reduce((s, i) => s + i.amount, 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, i) => s + i.amount, 0)
  const balance = totalIncome - totalExpense

  // ─── EXPORT LOGIC ───
  const exportPDF = () => {
    const doc = jsPDF()
    doc.text("SpendJer - Financial Report", 14, 15)
    
    const tableData = entries.map(e => [
      e.date,
      e.title,
      e.category.toUpperCase(),
      e.type.toUpperCase(),
      `RM ${e.amount.toFixed(2)}`
    ])

    doc.autoTable({
      head: [['Date', 'Title', 'Category', 'Type', 'Amount']],
      body: tableData,
      startY: 25,
      theme: 'grid',
      headStyles: { fillStyle: 'black', fillColor: [244, 114, 182] } // Hot Pink Header
    })

    doc.save(`finance_report_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // ─── CHART DATA (Simulated for Showcase) ───
  const chartData = [
    { day: 'Mon', inc: 120, exp: 45 },
    { day: 'Tue', inc: 0, exp: 80 },
    { day: 'Wed', inc: 200, exp: 30 },
    { day: 'Thu', inc: 50, exp: 120 },
    { day: 'Fri', inc: 300, exp: 65 },
    { day: 'Sat', inc: 0, exp: 150 },
    { day: 'Sun', inc: 100, exp: 40 },
  ]
  const maxVal = Math.max(...chartData.flatMap(d => [d.inc, d.exp]))

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-black font-mono selection:bg-pink-300">
      <div className="mx-auto max-w-md px-4 py-12 flex flex-col gap-8">

        {/* ── HEADER (BALANCE CARD) ── */}
        <header className="bg-[#C1FF72] border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-6 w-6" />
              <h1 className="text-xl font-black uppercase">SpendJer</h1>
            </div>
            <span className="text-[10px] font-black bg-black text-white px-2 py-0.5">EST. 2026</span>
          </div>
          
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-[10px] font-black uppercase text-pink-900">Available Balance</p>
            <p className="text-5xl font-black tracking-tighter">
              RM {balance.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t-2 border-pink-900 pt-4">
            <div>
              <p className="text-[9px] font-black uppercase text-pink-900">Total Income</p>
              <p className="text-lg font-black text-[#3b4c1a]">RM {totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-pink-900">Total Expense</p>
              <p className="text-lg font-black text-pink-900">RM {totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </header>


        {/* ── ANALYTICS (Pink vs Matcha) ── */}
        <section className="bg-white border-[3px] border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest underline decoration-pink-400">Activity</h2>
            <div className="flex gap-4 text-[8px] font-black uppercase">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#A3B18A] border border-black"></div> Income</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-400 border border-black"></div> Expense</div>
            </div>
          </div>

          <div className="flex items-end justify-between h-40 gap-1 px-1 border-b-2 border-black">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full">
                <div className="flex items-end gap-[1px] h-full w-full">
                  <div 
                    className="flex-1 bg-[#C1FF72] border-x border-t border-black transition-all hover:opacity-80" 
                    style={{ height: `${(d.inc / maxVal) * 100}%` }}
                  ></div>
                  <div 
                    className="flex-1 bg-pink-400 border-x border-t border-black transition-all hover:opacity-80" 
                    style={{ height: `${(d.exp / maxVal) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[7px] font-black mt-2">{d.day}</span>
              </div>
            ))}
          </div>
        </section>


        {/* ── INPUT FORM ── */}
        <section className="bg-white border-[3px] border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-[10px] font-black uppercase border-2 border-black transition-all ${type === 'expense' ? 'bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100'}`}
            >
              Expense
            </button>
            <button 
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-[10px] font-black uppercase border-2 border-black transition-all ${type === 'income' ? 'bg-[#C1FF72] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100'}`}
            >
              Income
            </button>
          </div>

          <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="ENTRY TITLE"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm font-black outline-none focus:bg-pink-50"
            />
            <input
              type="number"
              placeholder="0.00"
              required
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm font-black outline-none focus:bg-pink-50"
            />
            <button
              type="submit"
              className={`flex items-center justify-center gap-2 border-[3px] border-black py-4 text-sm font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none ${type === 'income' ? 'bg-[#C1FF72]' : 'bg-pink-400'}`}
            >
              <PlusIcon className="h-5 w-5" />
              Log {type}
            </button>
          </form>
        </section>


        {/* ── HISTORY & EXPORT ── */}
        <section className="flex flex-col gap-4 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-tighter italic">Transaction Feed</h2>
            <button 
              onClick={exportPDF}
              className="flex items-center gap-2 bg-black text-white px-3 py-1.5 text-[10px] font-black uppercase border-2 border-black hover:bg-pink-400 hover:text-black transition-all active:translate-y-1"
            >
              <DownloadIcon className="h-3 w-3" />
              Export PDF
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {entries.length === 0 ? (
              <div className="border-[3px] border-black p-8 text-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-black uppercase italic">No history found</p>
              </div>
            ) : (
              entries.map(item => (
                <div 
                  key={item.id}
                  className="bg-white border-[3px] border-black px-4 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-1 border-2 border-black ${item.type === 'income' ? 'bg-[#C1FF72]' : 'bg-pink-400'}`}>
                      {item.type === 'income' ? <TrendingUpIcon className="h-4 w-4" /> : <WalletIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase">{item.title}</p>
                      <p className="text-[8px] font-black text-gray-500 uppercase">{item.date} · {item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-sm font-black ${item.type === 'income' ? 'text-[#3b4c1a]' : 'text-pink-600'}`}>
                      {item.type === 'income' ? '+' : '-'} RM {item.amount.toFixed(2)}
                    </p>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-400 border-2 border-transparent hover:border-black transition-all"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="text-center pt-8 border-t-2 border-black mt-8">
          <p className="text-[11px] font-black uppercase tracking-[0.3em]">
            SpendJer <span className="text-pink-500">Edition</span>
          </p>
          <p className="text-[8px] font-black text-gray-500 uppercase">
            EST. 2026 · Secure & Local
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
