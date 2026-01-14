export type PricingBasis = 'PER_GUEST' | 'PER_EVENT'

export type Option = {
  type: string
  name: string
  display: string
  description: string
  price: number
  pricing_basis: PricingBasis
  active: boolean
}

export type OptionType = {
  name: string
  display: string
  plural: string
}

export type SubmissionData = {
  name: string
  email: string
  guestCount: number
  selectedOptions: Option[]
  specialInstructions: string
}
