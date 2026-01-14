'use client'

import type { ReactNode } from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/lib/theme'

type ThemeRegistryProps = {
  children: ReactNode
}

const ThemeRegistry = ({ children }: ThemeRegistryProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

export default ThemeRegistry
