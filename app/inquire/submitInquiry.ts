'use server'

export interface InquirySubmission {
  name: string
  email: string
  guestCount: number
  selectedOptions: string[]
  specialInstructions: string
  honeypot: string
}

export interface InquirySubmissionResult {
  status: 'ok' | 'invalid' | 'spam'
  errors?: string[]
  submission?: InquirySubmission
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function submitInquiry(
  formData: FormData,
): Promise<InquirySubmissionResult> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const guestCountRaw = String(formData.get('guestCount') ?? '').trim()
  const specialInstructions = String(
    formData.get('specialInstructions') ?? '',
  ).trim()
  const honeypot = String(formData.get('website') ?? '').trim()
  const selectedOptions = formData
    .getAll('selectedOptions')
    .map((value) => String(value))

  if (honeypot) {
    return {
      status: 'spam',
      submission: {
        name,
        email,
        guestCount: Number(guestCountRaw) || 0,
        selectedOptions,
        specialInstructions,
        honeypot,
      },
    }
  }

  const errors: string[] = []

  if (!name) {
    errors.push('Name is required.')
  }

  if (!email) {
    errors.push('Email address is required.')
  } else if (!isValidEmail(email)) {
    errors.push('Email address must be valid.')
  }

  const guestCount = Number(guestCountRaw)
  if (!Number.isFinite(guestCount)) {
    errors.push('Guest count is required.')
  } else if (!Number.isInteger(guestCount)) {
    errors.push('Guest count must be a whole number.')
  } else if (guestCount < 20 || guestCount > 300) {
    errors.push('Guest count must be between 20 and 300.')
  }

  const submission: InquirySubmission = {
    name,
    email,
    guestCount: Number.isFinite(guestCount) ? guestCount : 0,
    selectedOptions,
    specialInstructions,
    honeypot,
  }

  if (errors.length > 0) {
    return {
      status: 'invalid',
      errors,
      submission,
    }
  }

  return {
    status: 'ok',
    submission,
  }
}
