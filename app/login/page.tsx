'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(formData: FormData) {
    setError(null)
    setIsLoading(true)

    try {
      await login(
        formData.get('email') as string,
        formData.get('password') as string,
      )

      // Redirect if success — you probably want /dashboard or similar
      window.location.href = '/dashboard'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      style={{ maxWidth: 300, margin: '2rem auto', fontFamily: 'sans-serif' }}
    >
      <h2>Login</h2>

      {error && (
        <div
          style={{
            background: '#fee',
            border: '1px solid #f99',
            padding: '8px',
            marginBottom: '12px',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <form action={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          style={{ display: 'block', width: '100%', margin: '6px 0 12px' }}
          type="email"
          id="email"
          name="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          style={{ display: 'block', width: '100%', margin: '6px 0 12px' }}
          type="password"
          id="password"
          name="password"
          required
        />

        <button
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#0070f3',
            color: 'white',
            border: 0,
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </main>
  )
}
