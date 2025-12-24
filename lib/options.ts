import { Option, OptionType } from '@/lib/types'

export async function fetchOptionTypes(): Promise<OptionType[]> {
  const json = await fetch(`${process.env.BACKEND_URL}/options`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BACKEND_TOKEN as string,
    },
  }).then((response) => response.json())
  return json as OptionType[]
}

export async function fetchOptions(type: string): Promise<Option[]> {
  const json = await fetch(`${process.env.BACKEND_URL}/options/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BACKEND_TOKEN as string,
    },
  }).then((response) => response.json())
  return json as Option[]
}

export async function fetchBaseRate(): Promise<number> {
  const json = await fetch(`${process.env.BACKEND_URL}/options/base`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BACKEND_TOKEN as string,
    },
  }).then((response) => response.json())
  return json as number
}
