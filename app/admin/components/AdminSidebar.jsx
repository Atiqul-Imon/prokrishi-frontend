"use client";

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const navItems = [
  { 
    label: "Dashboard", 
    href: "/admin", 
    icon: DashboardIcon,
    description: "Overview and analytics"
  },
  { 
    label: "Products", 
    href: "/admin/products", 
    icon: InventoryIcon,
    description: "Manage product catalog"
  },
  { 
    label: "Orders", 
    href: "/admin/orders", 
    icon: OrdersIcon,
    description: "Order management"
  },
  { 
    label: "Customers", 
    href: "/admin/customers", 
    icon: PeopleIcon,
    description: "Customer management"
  },
  { 
    label: "Categories", 
    href: "/admin/categories", 
    icon: CategoryIcon,
    description: "Product categories"
  },
  { 
    label: "Reports", 
    href: "/admin/reports", 
    icon: ReportsIcon,
    description: "Analytics and insights"
  },
  { 
    label: "Settings", 
    href: "/admin/settings", 
    icon: SettingsIcon,
    description: "System configuration"
  },
  { 
    label: "Profile", 
    href: "/admin/profile", 
    icon: PersonIcon,
    description: "Admin profile"
  },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🌱 Prokrishi Admin
          </Typography>
        </Link>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Organic Food Management
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <ListItemButton
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      backgroundColor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                        minWidth: 40,
                      }}
                    >
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                        opacity: 0.8,
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © {new Date().getFullYear()} Prokrishi
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Version 2.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: theme.shadows[1],
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'background.paper',
            boxShadow: theme.shadows[2],
            '&:hover': {
              backgroundColor: 'background.paper',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
} 