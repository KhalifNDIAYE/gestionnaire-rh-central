import React, { ReactElement } from 'react'
import { vi } from 'vitest'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import userEvent from '@testing-library/user-event'

// Import screen and waitFor directly from testing library
import '@testing-library/jest-dom'

// Mock AuthContext
const mockAuthContext = {
  user: null,
  session: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
}

const AuthContext = React.createContext(mockAuthContext)

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        <BrowserRouter>
          {children}
          <Toaster />
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from @testing-library/react (which includes screen, waitFor, etc.)
export * from '@testing-library/react'
export { userEvent }

// Override render method
export { customRender as render }