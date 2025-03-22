import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  List as ListIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [membrosAnchorEl, setMembrosAnchorEl] = useState<null | HTMLElement>(null);

  const handleMembrosClick = (event: React.MouseEvent<HTMLElement>) => {
    setMembrosAnchorEl(event.currentTarget);
  };

  const handleMembrosClose = () => {
    setMembrosAnchorEl(null);
  };

  const menuItems = [
    {
      title: 'Membros',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      onClick: handleMembrosClick,
      color: '#1976d2',
      description: 'Gerenciar membros da igreja',
      submenu: [
        {
          title: 'Cadastrar Membro',
          icon: <AddIcon />,
          path: '/members/new',
          description: 'Adicionar novo membro'
        },
        {
          title: 'Listar Membros',
          icon: <ListIcon />,
          path: '/members/list',
          description: 'Visualizar e gerenciar membros'
        }
      ]
    },
    {
      title: 'Calendário',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      path: '/calendar',
      color: '#2e7d32',
      description: 'Agenda de eventos e atividades'
    }
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: typeof menuItems[0]) => {
    if (item.submenu) {
      handleMembrosClick(event);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleSubmenuClick = (path: string) => {
    handleMembrosClose();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/menu');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Início
          </Link>
        </Breadcrumbs>
      </Box>

      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Bem-vindo, {user?.fullName}
        </Typography>

        <Grid container spacing={4}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative'
                }}
                onClick={(event) => handleMenuClick(event, item)}
              >
                <div style={{ color: item.color }}>{item.icon}</div>
                <div style={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Submenu de Membros */}
        <MuiMenu
          anchorEl={membrosAnchorEl}
          open={Boolean(membrosAnchorEl)}
          onClose={handleMembrosClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: 200,
              '& .MuiMenuItem-root': {
                py: 1.5
              }
            }
          }}
        >
          {menuItems[0].submenu?.map((item) => (
            <MenuItem 
              key={item.title} 
              onClick={() => handleSubmenuClick(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                secondary={item.description}
              />
            </MenuItem>
          ))}
        </MuiMenu>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            mt: 6, 
            display: 'block', 
            mx: 'auto',
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white'
            }
          }}
        >
          Sair
        </Button>
      </Paper>
    </Container>
  );
};

export default Menu; 