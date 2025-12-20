import { Option } from '@/lib/types'

export async function fetchOptions(type: string): Promise<Option[]> {
  const json = await fetch(`${process.env.BACKEND_URL}/options/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BACKEND_TOKEN as string,
    },
  }).then((response) => response.json())
  return json as Option[]
}
