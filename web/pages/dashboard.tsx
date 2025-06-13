import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CardForm from '../components/CardForm'

interface Card {
  id: number
  title: string
  description: string
  created_at: string
  tag: string
  type: 'thought' | 'learning'
}

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([])
  const [typeFilter, setTypeFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setCards(data as Card[])
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this?')) return
    await supabase.from('cards').delete().eq('id', id)
    setCards(cards.filter(c => c.id !== id))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const years = Array.from(new Set(cards.map(c => new Date(c.created_at).getFullYear()))).sort()
  const tags = Array.from(new Set(cards.map(c => c.tag)))

  const filteredCards = cards.filter(card => {
    if (typeFilter && card.type !== typeFilter) return false
    const date = new Date(card.created_at)
    if (yearFilter && date.getFullYear().toString() !== yearFilter) return false
    if (monthFilter && (date.getMonth() + 1).toString() !== monthFilter) return false
    if (tagFilter && card.tag !== tagFilter) return false
    return true
  })

  return (
    <div className="min-h-screen p-4 max-w-xl mx-auto space-y-4">
      <div className="flex justify-end">
        <button onClick={signOut} className="text-sm text-blue-600 underline">
          Log Out
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Types</option>
          <option value="thought">Thought</option>
          <option value="learning">Learning</option>
        </select>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Tags</option>
          {tags.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      {filteredCards.map(card => (
        <div
          key={card.id}
          className={`border p-4 rounded shadow-sm bg-white ${
            card.type === 'thought'
              ? 'border-blue-500 bg-blue-50'
              : 'border-green-500 bg-green-50'
          }`}
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">{card.title}</h3>
            <button onClick={() => handleDelete(card.id)} className="text-red-500">
              Delete
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center space-x-2">
            <span
              className={`text-white text-xs px-2 py-1 rounded ${
                card.type === 'thought' ? 'bg-blue-500' : 'bg-green-500'
              }`}
            >
              {card.type}
            </span>
            <span>
              {new Date(card.created_at).toLocaleDateString()} - {card.tag}
            </span>
          </p>
          <p className="mt-2 text-gray-700">{card.description}</p>
        </div>
      ))}

      <CardForm type="thought" onCreated={fetchData} />
      <CardForm type="learning" onCreated={fetchData} />
    </div>
  )
}
