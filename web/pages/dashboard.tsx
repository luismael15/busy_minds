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

  const fetchData = async () => {
    const { data } = await supabase.from('cards').select('*').order('created_at', { ascending: false })
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

  return (
    <div className="min-h-screen p-4 max-w-xl mx-auto space-y-4">
      <div className="flex justify-end">
        <button onClick={signOut} className="text-sm text-blue-600 underline">
          Log Out
        </button>
      </div>
      {cards.map(card => (
        <div key={card.id} className="border p-4 rounded shadow-sm bg-white">
          <div className="flex justify-between">
            <h3 className="font-semibold">{card.title}</h3>
            <button onClick={() => handleDelete(card.id)} className="text-red-500">
              Delete
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(card.created_at).toLocaleDateString()} - {card.tag}
          </p>
          <p className="mt-2 text-gray-700">{card.description}</p>
        </div>
      ))}

      <CardForm type="thought" onCreated={fetchData} />
      <CardForm type="learning" onCreated={fetchData} />
    </div>
  )
}
