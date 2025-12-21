'use client'

import { Option, OptionType } from '@/lib/types'
import OptionSelection from './OptionSelection'
import { useMemo, useState } from 'react'
import {
  Box,
  Container,
  FormControl,
  Grid,
  TextField,
  FormLabel,
  Typography,
} from '@mui/material'
import NumberField from '@/components/NumberField'

interface InquireFormProps {
  allOptions: Option[]
  typeOptions: {
    type: OptionType
    options: Option[]
  }[]
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function toggle(setter: React.Dispatch<React.SetStateAction<string[]>>) {
  return (name: string, checked: boolean) => {
    setter((prev) =>
      checked ? [...prev, name] : prev.filter((n) => n !== name),
    )
  }
}

export default function InquireForm({
  allOptions,
  typeOptions,
}: InquireFormProps) {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<string>('')

  const estimatedPrice = useMemo(() => {
    if (!guestCount || selectedOptions.length === 0) return null
    return allOptions
      .filter((option) => selectedOptions.includes(option.name))
      .reduce((acc, option) => acc + option.cost * guestCount, 0)
  }, [selectedOptions, guestCount, allOptions])

  return (
    <Container maxWidth="md">
      <FormControl variant="standard" fullWidth>
        <FormLabel component="legend">Contact Details</FormLabel>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <NumberField
              required
              label="Guest Count"
              value={guestCount}
              min={20}
              max={300}
              onValueChange={setGuestCount}
            />
          </Grid>
        </Grid>
      </FormControl>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {typeOptions.map((typeOption) => (
          <Grid size={{ xs: 12, md: 6 }} key={typeOption.type.name}>
            <OptionSelection
              type={typeOption.type}
              options={typeOption.options}
              selectedOptions={selectedOptions}
              onChange={toggle(setSelectedOptions)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField
            fullWidth
            label="Special Instructions"
            variant="outlined"
            multiline
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box
        display="flex"
        alignItems="baseline"
        justifyContent="space-between"
        sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="body2" color="text.secondary">
          Estimated Price
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {estimatedPrice !== null ? formatter.format(estimatedPrice) : 'N/A'}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
        Final pricing may vary based on availability, options, and details.
      </Typography>
    </Container>
  )
}
