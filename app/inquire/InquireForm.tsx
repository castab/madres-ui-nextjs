'use client'

import { Option } from '@/lib/types'
import OptionSelection from './OptionSelection'
import { useState } from 'react'
import {
  Container,
  FormControl,
  Grid,
  TextField,
  FormLabel,
  Typography,
} from '@mui/material'
import NumberField from '@/components/NumberField'

interface InquireFormProps {
  appetizers: Option[]
  entrees: Option[]
  beverages: Option[]
  modifiers: Option[]
}

function toggle(setter: React.Dispatch<React.SetStateAction<string[]>>) {
  return (name: string, checked: boolean) => {
    setter((prev) =>
      checked ? [...prev, name] : prev.filter((n) => n !== name),
    )
  }
}

export default function InquireForm({
  appetizers,
  entrees,
  beverages,
  modifiers,
}: InquireFormProps) {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [selectedAppetizers, setSelectedAppetizers] = useState<string[]>([])
  const [selectedEntrees, setSelectedEntrees] = useState<string[]>([])
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([])
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<string>('')

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
        <Grid size={{ xs: 12, md: 6 }}>
          <OptionSelection
            type="Appetizers"
            options={appetizers}
            selectedOptions={selectedAppetizers}
            onChange={toggle(setSelectedAppetizers)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <OptionSelection
            type="Entrees"
            options={entrees}
            selectedOptions={selectedEntrees}
            onChange={toggle(setSelectedEntrees)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <OptionSelection
            type="Beverages"
            options={beverages}
            selectedOptions={selectedBeverages}
            onChange={toggle(setSelectedBeverages)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <OptionSelection
            type="Modifiers"
            options={modifiers}
            selectedOptions={selectedModifiers}
            onChange={toggle(setSelectedModifiers)}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" alignItems="flex-start" sx={{my: 2}}>
        <Grid size={9}>
          <Typography gutterBottom variant="h6">
            Estimated Cost:
          </Typography>
        </Grid>
        <Grid container size='grow' alignItems='center' justifyContent='flex-end' sx={{ mx: 1}}>
          <Grid size={4}>
            <Typography gutterBottom variant="h6" align='center'>
              $
            </Typography>
          </Grid>
          <Grid size='grow'>
            <Typography gutterBottom variant="h6">
              0.00
            </Typography>
          </Grid>
        </Grid>
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
    </Container>
  )
}
