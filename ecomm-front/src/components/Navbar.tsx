import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import LogoSvg from './LogoSvg';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Store', path: '/' },
    { label: 'Categories', path: '/' },
    { label: 'About Us', path: '/' },
    { label: 'Contact us', path: '/' },
    { label: 'Logout', path: '/' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2 }}>
        <Link to="/" className="flex items-center justify-center">
          <LogoSvg className='h-10 text-[#172B3C]' />
        </Link>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className="bg-white text-gray-800 shadow-sm">
        <Toolbar className="container mx-auto">
          <Link to="/" className="flex items-center">
            <LogoSvg className='h-10 text-white' />
          </Link>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} className="ml-auto">
            {navItems.map((item) => (
              <Button 
                key={item.label}
                component={Link}
                to={item.path}
                sx={{ color: 'inherit' }}
                className="hover:text-blue-600"
              >
                {item.label}
              </Button>
            ))}
          </Box>
          
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 'auto', display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;