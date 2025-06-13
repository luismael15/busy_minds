import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CardModal from '../components/CardModal'
import { FaBrain } from 'react-icons/fa'
import { FiMenu, FiTrash } from 'react-icons/fi'

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
  const [showForm, setShowForm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) setUserEmail(user.email ?? '')
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
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <FaBrain className="text-pink-500" />
          <span>Busy Minds</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80"
          >
            Add
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
              <FiMenu />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bg-white shadow rounded-md mt-2 text-sm">
                <p className="px-4 py-2 border-b">{userEmail}</p>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className={`border p-2 rounded-md bg-white ${typeFilter ? 'border-primary' : ''}`}
        >
          <option value="">All Types</option>
          <option value="thought">Thought</option>
          <option value="learning">Learning</option>
        </select>
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className={`border p-2 rounded-md bg-white ${yearFilter ? 'border-primary' : ''}`}
        >
          <option value="">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className={`border p-2 rounded-md bg-white ${monthFilter ? 'border-primary' : ''}`}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className={`border p-2 rounded-md bg-white ${tagFilter ? 'border-primary' : ''}`}
        >
          <option value="">All Tags</option>
          {tags.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      {filteredCards.map(card => (
        <div
          key={card.id}
          className={`border p-4 rounded-xl shadow-sm bg-white/70 ${
            card.type === 'thought'
              ? 'border-primary/60'
              : 'border-green-400'
          }`}
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">{card.title}</h3>
            <button onClick={() => handleDelete(card.id)} className="text-red-500 hover:text-red-700" title="Delete">
              <FiTrash />
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center space-x-2">
            <span
              className={`text-white text-xs px-2 py-1 rounded-full ${
                card.type === 'thought' ? 'bg-primary' : 'bg-green-500'
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

      {filteredCards.length === 0 && (
        <div className="text-center py-10 space-y-4">
          <FaBrain className="mx-auto text-pink-500" size={48} />
          <p className="text-gray-500">There is no thought or learning</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80"
          >
            Add
          </button>
        </div>
      )}

      {showForm && <CardModal onClose={() => setShowForm(false)} onCreated={fetchData} />}
    </div>
  )
}
