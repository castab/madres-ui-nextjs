import { Option, PricingBasis } from '@/lib/types'

export interface PriceLineItem {
  type: string | null
  label: string
  amount: number
  basis: PricingBasis
}

export interface PriceEstimate {
  total: number
  perGuestSubtotal: number
  perEventSubtotal: number
  guestCount: number
  lineItems: PriceLineItem[]
}

function castToNumberOrNull(value: string): number | null {
  const numberValue = Number(value)
  if (isNaN(numberValue)) {
    return null
  }
  return numberValue
}

function perGuestDiscount(
  guestCount: number,
  {
    minGuests = castToNumberOrNull(process.env.MIN_GUESTS || '') || 50,
    maxGuests = castToNumberOrNull(process.env.MAX_GUESTS || '') || 300,
    maxDiscount = castToNumberOrNull(process.env.MAX_DISCOUNT || '') || 4,
  } = {},
): number {
  if (guestCount <= minGuests) return 0
  if (guestCount >= maxGuests) return maxDiscount

  const t = (guestCount - minGuests) / (maxGuests - minGuests)

  // quadratic ease-in
  return maxDiscount * t * t
}

export function estimatePrice(
  baseRate: number,
  guestCount: number,
  selectedOptions: Option[],
): PriceEstimate {
  const lineItems: PriceLineItem[] = []

  let perGuest = baseRate

  // 1️⃣ Base rate line item
  lineItems.push({
    type: 'BASE',
    label: 'Base catering rate',
    amount: baseRate,
    basis: 'PER_GUEST',
  })

  // 2️⃣ ENTREE HANDLING (⬅️ DROP NEW CODE HERE)
  const INCLUDED_ENTREE_COUNT = 2

  const selectedEntrees = selectedOptions
    .filter((o) => o.type === 'ENTREE')
    .sort((a, b) => b.price - a.price)

  const includedEntrees = selectedEntrees.slice(0, INCLUDED_ENTREE_COUNT)
  const chargedEntrees = selectedEntrees.slice(INCLUDED_ENTREE_COUNT)

  // Included entrees (most expensive)
  for (const entree of includedEntrees) {
    lineItems.push({
      type: entree.type,
      label: `${entree.display} (included)`,
      amount: 0,
      basis: 'PER_GUEST',
    })
  }

  // Charged entrees
  for (const entree of chargedEntrees) {
    perGuest += entree.price

    lineItems.push({
      type: entree.type,
      label: entree.display,
      amount: entree.price,
      basis: 'PER_GUEST',
    })
  }

  // 3️⃣ PER-GUEST add-ons (non-entree)
  const perGuestOptions = selectedOptions.filter(
    (o) => o.type !== 'ENTREE' && o.pricing_basis === 'PER_GUEST',
  )

  for (const option of perGuestOptions) {
    perGuest += option.price

    lineItems.push({
      type: option.type,
      label: option.display,
      amount: option.price,
      basis: 'PER_GUEST',
    })
  }

  // 4️⃣ PER-EVENT add-ons
  const perEventOptions = selectedOptions.filter(
    (o) => o.type !== 'ENTREE' && o.pricing_basis === 'PER_EVENT',
  )

  const perEventSubtotal = perEventOptions.reduce((sum, o) => sum + o.price, 0)

  for (const option of perEventOptions) {
    lineItems.push({
      type: option.type,
      label: option.display,
      amount: option.price,
      basis: 'PER_EVENT',
    })
  }

  // 5️⃣ Discount
  const discount = perGuestDiscount(guestCount)
  if (discount > 0) {
    perGuest -= discount

    lineItems.push({
      type: 'DISCOUNT',
      label: 'Guest count discount',
      amount: -discount,
      basis: 'PER_GUEST',
    })
  }

  // 6️⃣ Totals
  const perGuestSubtotal = perGuest * guestCount
  const total = perGuestSubtotal + perEventSubtotal

  return {
    total,
    perGuestSubtotal,
    perEventSubtotal,
    guestCount,
    lineItems,
  }
}
