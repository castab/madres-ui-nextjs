import { fetchOptions, fetchOptionTypes } from '@/lib/options'
import InquireForm from './InquireForm'

export default async function InquirePage() {
  const types = await fetchOptionTypes()
  const typeOptions = await Promise.all(
    types.map(async (type) => {
      const options = await fetchOptions(type.name.toLowerCase())
      return { type: type, options: options }
    }),
  )
  return <InquireForm typeOptions={typeOptions} />
}
