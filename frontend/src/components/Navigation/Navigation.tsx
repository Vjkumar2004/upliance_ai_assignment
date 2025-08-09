import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Create as CreateIcon,
  Visibility as PreviewIcon,
  List as ListIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Create Form', icon: <CreateIcon />, path: '/create' },
    { text: 'Preview Form', icon: <PreviewIcon />, path: '/preview' },
    { text: 'My Forms', icon: <ListIcon />, path: '/myforms' }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="primary">
          Form Builder
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Form Builder
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? drawerOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              top: ['48px', '56px', '64px'],
              height: 'auto',
              bottom: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;
