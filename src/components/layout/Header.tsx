import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Group, Text, UnstyledButton, Title, Container, Burger, Collapse, Stack, Box } from '@mantine/core';
import { IconPackage, IconFolder, IconMapPin } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navItems = [
    { path: '/', label: 'Items', icon: IconPackage },
    { path: '/categories', label: 'Categories', icon: IconFolder },
    { path: '/locations', label: 'Locations', icon: IconMapPin },
  ];

  const handleNavClick = () => {
    setMobileMenuOpened(false);
  };

  return (
    <Box>
      <header style={{
        background: 'linear-gradient(135deg, #010d17 0%, #1a1a1a 100%)',
        borderBottom: '1px solid #92bbe3',
        minHeight: '70px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container size="xl" px="md" style={{ width: '100%' }}>
          <Group justify="space-between" h="70px">
            <Link to="/" style={{ textDecoration: 'none' }} onClick={handleNavClick}>
              <Group gap={isMobile ? "xs" : "sm"}>
                <IconPackage size={isMobile ? 28 : 32} color="#92bbe3" />
                <Title order={2} c="white" fw={700} size={isMobile ? "h3" : "h2"}>
                  Chattels
                </Title>
              </Group>
            </Link>
            
            {/* Desktop Navigation */}
            {!isMobile && (
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
                      backgroundColor: location.pathname === path ? '#134168' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          backgroundColor: location.pathname === path ? '#0f3054' : 'rgba(146, 187, 227, 0.1)',
                        }
                      }
                    }}
                  >
                    <Group gap="xs">
                      <Icon size={18} color={location.pathname === path ? 'white' : '#92bbe3'} />
                      <Text 
                        size="sm" 
                        fw={500} 
                        c={location.pathname === path ? 'white' : '#92bbe3'}
                      >
                        {label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                ))}
              </Group>
            )}

            {/* Mobile Burger Menu */}
            {isMobile && (
              <Burger
                opened={mobileMenuOpened}
                onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
                color="#92bbe3"
                size="sm"
              />
            )}
          </Group>
        </Container>
      </header>

      {/* Mobile Menu Collapse */}
      {isMobile && (
        <Collapse in={mobileMenuOpened}>
          <Box
            style={{
              background: 'linear-gradient(135deg, #010d17 0%, #1a1a1a 100%)',
              borderBottom: '1px solid #92bbe3',
              paddingBottom: '1rem',
            }}
          >
            <Container size="xl" px="md">
              <Stack gap="xs" pt="sm">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <UnstyledButton
                    key={path}
                    component={Link}
                    to={path}
                    onClick={handleNavClick}
                    px="md"
                    py="sm"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: location.pathname === path ? '#134168' : 'transparent',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          backgroundColor: location.pathname === path ? '#0f3054' : 'rgba(146, 187, 227, 0.1)',
                        }
                      }
                    }}
                  >
                    <Group gap="sm">
                      <Icon size={20} color={location.pathname === path ? 'white' : '#92bbe3'} />
                      <Text 
                        size="md" 
                        fw={500} 
                        c={location.pathname === path ? 'white' : '#92bbe3'}
                      >
                        {label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            </Container>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
