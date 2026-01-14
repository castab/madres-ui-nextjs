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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NumberField from '@/components/NumberField'
import { estimatePrice } from './action'

interface InquireFormProps {
  typeOptions: {
    type: OptionType
    options: Option[]
  }[]
  baseRate: number
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

export default function InquireForm({
  typeOptions,
  baseRate,
}: InquireFormProps) {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<string>('')

  const priceBreakdown =
    guestCount == null
      ? null
      : estimatePrice(baseRate, guestCount, selectedOptions)
  const formattedTotal = priceBreakdown
    ? formatter.format(priceBreakdown.total)
    : 'N/A'

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2 } }}>
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
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Accordion elevation={0} disableGutters>
          <AccordionSummary
            disabled={priceBreakdown === null}
            expandIcon={<ExpandMoreIcon />}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Box display="flex" alignItems="center" gap={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Price
                </Typography>
              </Box>

              <Typography variant="body1" fontWeight={600}>
                {formattedTotal}
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {priceBreakdown &&
              priceBreakdown.lineItems.map((item, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  justifyContent="space-between"
                  mb={0.5}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>

                  <Typography variant="body2">
                    {formatter.format(item.amount)}
                    {item.basis === 'PER_GUEST' && '/guest'}
                    {item.basis === 'PER_EVENT' && '/event'}
                  </Typography>
                </Box>
              ))}
          </AccordionDetails>
        </Accordion>

        <Typography variant="caption" color="text.secondary">
          Final pricing may vary based on availability, options, and details.
        </Typography>
      </Box>
    </Container>
  )
}
