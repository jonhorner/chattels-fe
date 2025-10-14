import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, createTheme } from '@mantine/core';
import { Layout } from './components/layout';
import { ItemsPageMantine as ItemsPage } from './pages/ItemsPageMantine';
import { CategoriesPageMantine as CategoriesPage } from './pages/CategoriesPageMantine';
import { LocationsPage } from './pages/LocationsPage';
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

// Create Mantine theme with dark red color scheme
const theme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'red',
  colors: {
    red: [
      '#ffe6e6',
      '#ffb3b3',
      '#ff8080',
      '#ff4d4d',
      '#ff1a1a',
      '#e60000',
      '#cc0000',
      '#b30000',
      '#990000',
      '#800000',
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
      '#01010a',
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
