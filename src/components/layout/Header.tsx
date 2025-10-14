import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Group, Text, UnstyledButton, Title, Container } from '@mantine/core';
import { IconPackage, IconFolder, IconMapPin } from '@tabler/icons-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Items', icon: IconPackage },
    { path: '/categories', label: 'Categories', icon: IconFolder },
    { path: '/locations', label: 'Locations', icon: IconMapPin },
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderBottom: '1px solid #e03131',
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container size="xl" px="lg" style={{ width: '100%' }}>
        <Group justify="space-between" h="100%">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Group gap="sm">
              <IconPackage size={32} color="#e03131" />
              <Title order={2} c="white" fw={700}>
                Chattels
              </Title>
            </Group>
          </Link>
          
          <Group gap="xs">
            {navItems.map(({ path, label, icon: Icon }) => (
              <UnstyledButton
                key={path}
                component={Link}
                to={path}
                px="md"
                py="sm"
                style={{
                  borderRadius: '8px',
                  backgroundColor: location.pathname === path ? '#e03131' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: location.pathname === path ? '#cc2b2b' : 'rgba(224, 49, 49, 0.1)',
                  }
                }}
              >
                <Group gap="xs">
                  <Icon size={18} color={location.pathname === path ? 'white' : '#e03131'} />
                  <Text 
                    size="sm" 
                    fw={500} 
                    c={location.pathname === path ? 'white' : '#e03131'}
                  >
                    {label}
                  </Text>
                </Group>
              </UnstyledButton>
            ))}
          </Group>
        </Group>
      </Container>
    </header>
  );
};
