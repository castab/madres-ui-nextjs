import { Option } from '@/lib/types'

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
): number {
  let perGuest = baseRate

  // First two entrees are included in minimum charge
  const selectedEntrees = selectedOptions
    .filter((option) => option.type === 'ENTREE')
    .sort((a, b) => a.price - b.price)

  if (selectedEntrees.length > 2) {
    perGuest += selectedEntrees[2].price
  }

  const additionalPerGuestCosts = selectedOptions
    .filter(
      (option) =>
        option.type !== 'ENTREE' && option.pricing_basis !== 'PER_GUEST',
    )
    .reduce((acc, option) => acc + option.price, 0)

  const additionalPerEventCosts = selectedOptions
    .filter(
      (option) =>
        option.type !== 'ENTREE' && option.pricing_basis === 'PER_EVENT',
    )
    .reduce((acc, option) => acc + option.price, 0)

  // Apply per guest discount
  const discount = perGuestDiscount(guestCount)
  perGuest -= discount
  const totalCost =
    (perGuest + additionalPerGuestCosts) * guestCount + additionalPerEventCosts
  return totalCost
}
