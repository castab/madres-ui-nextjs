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
  guestCount: number,
  selectedOptions: Option[],
): number {
  let perGuest = castToNumberOrNull(process.env.PER_GUEST_PRICE || '') || 22.0

  // First two entrees are included in minimum charge
  const selectedEntrees = selectedOptions
    .filter((option) => option.type === 'ENTREE')
    .sort((a, b) => a.cost - b.cost)

  if (selectedEntrees.length > 2) {
    perGuest += selectedEntrees[2].cost
  }

  // For anything not an entree and not the travel modifier
  // add the cost to the per guest price
  const additionalCosts = selectedOptions
    .filter(
      (option) =>
        option.type !== 'ENTREE' && option.name !== 'OUTSIDE_SERVICE_AREA',
    )
    .reduce((acc, option) => acc + option.cost, 0)

  perGuest += additionalCosts

  // If the travel modifier is selected, add the cost to the total
  const travelModifier = selectedOptions.find(
    (option) => option.name === 'OUTSIDE_SERVICE_AREA',
  )
  const travelCost = travelModifier ? travelModifier.cost : 0

  // Apply per guest discount
  const discount = perGuestDiscount(guestCount)
  perGuest -= discount

  const totalCost = perGuest * guestCount + travelCost

  return totalCost
}
