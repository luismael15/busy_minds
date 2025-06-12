import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif">Busy Minds</h1>
        <p className="max-w-md mx-auto text-gray-600">
          An oasis for fast, idea-filled minds to organize thoughts and learnings.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign Up / Log In
        </Link>
      </div>
    </div>
  )
}
