import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/user');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      setSuccess('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Bookings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Court</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.court_name}</TableCell>
                    <TableCell>
                      {format(new Date(booking.booking_date), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      {`${booking.start_time} - ${booking.end_time}`}
                    </TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      {booking.status === 'active' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default MyBookings;
