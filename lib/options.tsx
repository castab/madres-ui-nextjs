import { Option } from '@/lib/types'

export async function fetchOptions(type: string): Promise<Option[]> {
  const json = await fetch(
    `https://backend.madrestacoshop.com/options/${type}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'SOME_TOKEN',
      },
    },
  ).then((response) => response.json())
  return json as Option[]
}
