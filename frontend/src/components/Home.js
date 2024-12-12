import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to Pickleball Courts
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Book your court today and enjoy a game of pickleball!
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4} justifyContent="center">
            {!user ? (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/register"
                    size="large"
                  >
                    Sign Up Now
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/login"
                    size="large"
                  >
                    Login
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/book"
                  size="large"
                >
                  Book a Court
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Easy Booking
            </Typography>
            <Typography>
              Book your preferred court with just a few clicks. View real-time availability and manage your reservations easily.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Multiple Courts
            </Typography>
            <Typography>
              Choose from multiple courts available throughout the day. Perfect for both casual players and tournaments.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Flexible Schedule
            </Typography>
            <Typography>
              Courts available from 9 AM to 6 PM daily. Book in advance or check same-day availability.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
