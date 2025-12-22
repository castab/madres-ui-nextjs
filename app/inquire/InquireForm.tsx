'use client'

import { Option, OptionType } from '@/lib/types'
import OptionSelection from './OptionSelection'
import { useState } from 'react'
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
import { estimatePrice } from './action'

interface InquireFormProps {
  typeOptions: {
    type: OptionType
    options: Option[]
  }[]
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function toggle(setter: React.Dispatch<React.SetStateAction<Option[]>>) {
  return (option: Option, checked: boolean) => {
    setter((prev) =>
      checked ? [...prev, option] : prev.filter((o) => o.name !== option.name),
    )
  }
}

export default function InquireForm({ typeOptions }: InquireFormProps) {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<string>('')

  const estimatedPrice =
    guestCount != null
      ? formatter.format(estimatePrice(guestCount, selectedOptions))
      : null

  return (
    <Container maxWidth="md" sx={{ pb: { xs: 10, md: 0 } }}>
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
        position="sticky"
        bottom={0}
        zIndex={1}
        bgcolor="background.paper"
        px={2}
        py={1.5}
        sx={{
          mt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          display="flex"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Typography variant="body2" color="text.secondary">
            Estimated Price
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {estimatedPrice ?? 'N/A'}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Final pricing may vary based on availability, options, and details.
        </Typography>
      </Box>
    </Container>
  )
}
