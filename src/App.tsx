import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, createTheme } from '@mantine/core';
import { Layout } from './components/layout';
import { ItemsPageMantine as ItemsPage } from './pages/ItemsPageMantine';
import { CategoriesPageMantine as CategoriesPage } from './pages/CategoriesPageMantine';
import { LocationsPageMantine as LocationsPage } from './pages/LocationsPageMantine';
import '@mantine/core/styles.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create Mantine theme with blue color scheme
const theme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e6f2ff',
      '#b3d9ff',
      '#80c1ff',
      '#4da8ff',
      '#92bbe3', // Light blue
      '#6ba3d6',
      '#4a8bc2',
      '#2973ae',
      '#134168', // Dark blue
      '#0a2c4a',
    ],
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#010d17', // Very dark blue
    ],
  },
  fontFamily: 'system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  defaultRadius: 'md',
  primaryShade: 6,
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ItemsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App
