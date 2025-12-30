'use server'

import { cookies } from 'next/headers'
import { verify } from 'argon2'

type UserAuthWire = {
  id: string
  email: string
  password_hash: string
}

type UserAuth = {
  id: string
  email: string
  passwordHash: string
}

export async function login(email: string, password: string) {
  const userResponse = await fetch(`${process.env.BACKEND_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BACKEND_TOKEN!,
    },
    cache: 'no-store',
    body: JSON.stringify({ email: email.toLowerCase() }),
  })

  if (!userResponse.ok) throw new Error('Invalid credentials')

  const wire = (await userResponse.json()) as UserAuthWire | null
  if (!wire) throw new Error('Invalid credentials')

  const user: UserAuth = {
    id: wire.id,
    email: wire.email,
    passwordHash: wire.password_hash,
  }

  const valid = await verify(user.passwordHash, password)
  if (!valid) throw new Error('Invalid credentials')
  const sessionResponse = await fetch(`${process.env.BACKEND_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BACKEND_TOKEN!,
    },
    cache: 'no-store',
    body: JSON.stringify({ user_id: user.id }),
  })

  if (!sessionResponse.ok) throw new Error('Failed to create session')
  const { sessionId } = (await sessionResponse.json()) as { sessionId: string }
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'session',
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  if (!sessionId) return null

  const sessionResponse = await fetch(
    `${process.env.BACKEND_URL}/sessions/${sessionId}`,
    {
      headers: { Authorization: process.env.BACKEND_TOKEN! },
      cache: 'no-store',
    },
  )

  if (!sessionResponse.ok) return null

  const user = await sessionResponse.json()
  return user
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  if (!sessionId) return

  await fetch(`${process.env.BACKEND_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { Authorization: process.env.BACKEND_TOKEN! },
    cache: 'no-store',
  })

  cookieStore.delete('session')
}
