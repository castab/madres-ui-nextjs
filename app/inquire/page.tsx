import { fetchOptions } from '@/lib/options'
import InquireForm from './InquireForm'

export default async function InquirePage() {
  const [appetizers, entrees, beverages, modifiers] = await Promise.all([
    fetchOptions('appetizer'),
    fetchOptions('entree'),
    fetchOptions('beverage'),
    fetchOptions('modifier'),
  ])
  return (
    <InquireForm
      appetizers={appetizers}
      entrees={entrees}
      beverages={beverages}
      modifiers={modifiers}
    />
  )
}
