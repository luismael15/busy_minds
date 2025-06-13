import CardForm from './CardForm'

interface Props {
  onClose: () => void
  onCreated: () => void
}

export default function CardModal({ onClose, onCreated }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <CardForm onCreated={() => { onCreated(); onClose(); }} />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
