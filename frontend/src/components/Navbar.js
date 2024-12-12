import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Pickleball Courts
          </Typography>
          <Box>
            {user ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/book"
                >
                  Book Court
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/my-bookings"
                >
                  My Bookings
                </Button>
                <Button
                  color="inherit"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
