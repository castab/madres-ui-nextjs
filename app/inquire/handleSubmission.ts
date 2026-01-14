'use server'

import { SubmissionData } from '@/lib/types'

export default async function handleSubmission(submissionData: SubmissionData) {
  console.log('Form submitted:', submissionData)
}
