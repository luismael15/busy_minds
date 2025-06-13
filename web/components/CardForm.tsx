import { useState } from 'react'
import { supabase } from '../lib/supabase'

type CardType = 'thought' | 'learning'

interface Props {
  type: CardType
  onCreated: () => void
}

export default function CardForm({ type, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')

  const tags =
    type === 'thought'
      ? [
          'Stressed about it',
          'Very important',
          'Important but not now',
          'I care now – let\'s see in the future',
        ]
      : ['Professional', 'Personal', 'Spiritual', 'Family', 'Friends', 'Relationship']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    const {
      data: { user },
    } = await supabase.auth.getUser()
    await supabase.from('cards').insert({
      title,
      description,
      tag,
      type,
      user_id: user?.id,
    })
    setTitle('')
    setDescription('')
    setTag('')
    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-accent/50 p-6 rounded-xl bg-white/70 shadow">
      <h2 className="font-semibold capitalize">Create {type}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border w-full p-2 rounded-md"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border w-full p-2 rounded-md"
      />
      <select value={tag} onChange={e => setTag(e.target.value)} className="border w-full p-2 rounded-md bg-white">
        <option value="" disabled>
          Select tag
        </option>
        {tags.map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80">
        Add
      </button>
    </form>
  )
}
