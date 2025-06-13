import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6 bg-white/60 rounded-3xl p-10 shadow-md">
        <h1 className="text-5xl font-semibold text-gray-800 tracking-tight">Busy Minds</h1>
        <p className="max-w-md mx-auto text-gray-600 text-lg">
          Your calm space to capture thoughts and cherished learnings.
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/80"
        >
          Sign Up / Log In
        </Link>
      </div>
    </div>
  )
}
