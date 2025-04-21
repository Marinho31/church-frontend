import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Church as ChurchIcon,
  VolunteerActivism as VolunteerIcon,
  ExitToApp as LogoutIcon,
  ExpandLess,
  ExpandMore,
  List as ListIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMembersClick = () => {
    setMembersOpen(!membersOpen);
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/members/edit')) {
      return 'Edição de Membro';
    }
    if (location.pathname.includes('/members/new')) {
      return 'Cadastro de Membro';
    }
    if (location.pathname === '/menu' || location.pathname === '/') {
      return 'Menu Principal';
    }
    if (location.pathname.includes('/members/list')) {
      return 'Lista de Membros';
    }
    return '';
  };

  const showBackButton = () => {
    return location.pathname.includes('/members/edit') || 
           location.pathname.includes('/members/new') ||
           location.pathname.includes('/members/list');
  };

  const handleBack = () => {
    if (location.pathname.includes('/members/edit') || location.pathname.includes('/members/new')) {
      navigate('/members/list');
    } else if (location.pathname.includes('/members/list')) {
      navigate('/menu');
    }
  };

  const menuItems = [
    { text: 'Eventos', icon: <EventIcon />, path: '/dashboard/events' },
    { text: 'Ministérios', icon: <VolunteerIcon />, path: '/dashboard/ministries' },
    { text: 'Cultos', icon: <ChurchIcon />, path: '/dashboard/services' },
  ];

  const drawer = (
    <div>
      <Toolbar 
        sx={{ 
          minHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#800020', // Cor vinho
          color: 'white',
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem 
          onClick={handleMembersClick}
          sx={{ 
            '&:hover': { 
              backgroundColor: 'rgba(51, 51, 51, 0.04)' 
            }
          }}
        >
          <ListItemIcon>
            <PeopleIcon sx={{ color: '#333333' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Membros" 
            sx={{ 
              '& .MuiTypography-root': { 
                color: '#333333',
                fontWeight: membersOpen ? 600 : 400
              } 
            }} 
          />
          {membersOpen ? <ExpandLess sx={{ color: '#333333' }} /> : <ExpandMore sx={{ color: '#333333' }} />}
        </ListItem>
        <Collapse in={membersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              onClick={() => {
                navigate('/members/list');
                if (isMobile) setMobileOpen(false);
              }}
              sx={{ 
                pl: 4,
                '&:hover': { 
                  backgroundColor: 'rgba(51, 51, 51, 0.04)' 
                }
              }}
            >
              <ListItemIcon>
                <ListIcon sx={{ color: '#333333' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Lista" 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: '#333333' 
                  } 
                }} 
              />
            </ListItem>
            <ListItem
              onClick={() => {
                navigate('/members/new');
                if (isMobile) setMobileOpen(false);
              }}
              sx={{ 
                pl: 4,
                '&:hover': { 
                  backgroundColor: 'rgba(51, 51, 51, 0.04)' 
                }
              }}
            >
              <ListItemIcon>
                <PersonAddIcon sx={{ color: '#333333' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Novo" 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: '#333333' 
                  } 
                }} 
              />
            </ListItem>
          </List>
        </Collapse>

        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(51, 51, 51, 0.04)' 
              }
            }}
          >
            <ListItemIcon>
              {React.cloneElement(item.icon, { sx: { color: '#333333' } })}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiTypography-root': { 
                  color: '#333333' 
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          onClick={logout}
          sx={{ 
            '&:hover': { 
              backgroundColor: 'rgba(51, 51, 51, 0.04)' 
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#333333' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Sair" 
            sx={{ 
              '& .MuiTypography-root': { 
                color: '#333333' 
              } 
            }} 
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: '#333333',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            minHeight: '64px',
            position: 'fixed',
            top: 0,
            left: { sm: drawerWidth },
            right: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showBackButton() && (
              <IconButton
                color="inherit"
                onClick={handleBack}
                sx={{ padding: '8px' }}
              >
                <ArrowLeft />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ color: '#333333', fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>
          </div>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="body1" sx={{ color: '#333333' }}>
            {user?.fullName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              mt: '64px',
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 