import { Option, OptionType } from '@/lib/types'
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Collapse,
  Box,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useState } from 'react'

function OptionRow({
  option,
  checked,
  onToggle,
}: {
  option: Option
  checked: boolean
  onToggle: (checked: boolean) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onToggle(e.target.checked)}
          />
        }
        label={
          <Box display="flex" alignItems="center" gap={1}>
            {option.display}

            {option.description && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault()
                  setOpen((v) => !v)
                }}
              >
                <InfoOutlinedIcon
                  fontSize="small"
                  color={open ? 'primary' : 'action'}
                />
              </IconButton>
            )}
          </Box>
        }
      />

      <Collapse in={open} timeout="auto">
        <FormHelperText sx={{ ml: 4 }}>{option.description}</FormHelperText>
      </Collapse>
    </Box>
  )
}

interface OptionSelectionProps {
  type: OptionType
  options: Option[]
  selectedOptions: string[]
  onChange: (name: string, checked: boolean) => void
}

export default function OptionSelection({
  type,
  options,
  selectedOptions,
  onChange,
}: OptionSelectionProps) {
  return (
    <>
      <FormLabel component="legend" sx={{ mb: 1 }}>
        {type.plural}
      </FormLabel>
      {options.map((option) => (
        <OptionRow
          key={option.name}
          option={option}
          checked={selectedOptions.includes(option.name)}
          onToggle={(checked) => onChange(option.name, checked)}
        />
      ))}
    </>
  )
}
