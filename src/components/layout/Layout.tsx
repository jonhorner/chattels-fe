import React from 'react';
import { AppShell, Container } from '@mantine/core';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        minHeight: '100vh',
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      
      <AppShell.Main>
        <Container size="xl" px="lg">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
