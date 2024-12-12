import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import axios from 'axios';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courts, setCourts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courts/availability`, {
        params: {
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });
      setCourts(response.data);
    } catch (err) {
      setError('Failed to fetch court availability');
    }
  };

  const handleBooking = async (courtId, startTime) => {
    try {
      const endTime = format(new Date(`2000-01-01 ${startTime}`).getTime() + 3600000, 'HH:mm');
      await axios.post('http://localhost:5000/api/bookings', {
        court_id: courtId,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
      });
      setSuccess('Booking successful!');
      fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  const isSlotBooked = (court, time) => {
    return court.bookings.some(booking => 
      booking.start_time <= time && 
      booking.end_time > time && 
      booking.status === 'active'
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Book a Court
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

          <Box sx={{ mb: 4 }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              disablePast
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Time
              </Typography>
              {timeSlots.map((time) => (
                <Box key={time} sx={{ height: 60, display: 'flex', alignItems: 'center' }}>
                  {time}
                </Box>
              ))}
            </Grid>

            {courts.map((court) => (
              <Grid item xs={2} key={court.id}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {court.name}
                </Typography>
                {timeSlots.map((time) => (
                  <Box key={time} sx={{ height: 60, display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      color={isSlotBooked(court, time) ? 'error' : 'primary'}
                      disabled={isSlotBooked(court, time)}
                      onClick={() => handleBooking(court.id, time)}
                      fullWidth
                    >
                      {isSlotBooked(court, time) ? 'Booked' : 'Book'}
                    </Button>
                  </Box>
                ))}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookingCalendar;
