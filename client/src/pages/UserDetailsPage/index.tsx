import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Rating,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchUserById, fetchUserBorrowingHistory } from '../../redux/slices/usersSlice';
import { borrowingApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useState } from 'react';

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedUser: user, borrowingHistory, loading, error } = useAppSelector(
    (state: RootState) => state.users
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(parseInt(id)));
      dispatch(fetchUserBorrowingHistory(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleReturn = async (record: any) => {
    try {
      const ratingInput = prompt('Please rate the book (1-5, decimals allowed):', '5');
      if (ratingInput === null) {
        return; // User cancelled
      }
      
      const rating = Number(ratingInput);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        setErrorMessage('Please enter a valid rating between 1 and 5');
        setShowError(true);
        return;
      }

      await borrowingApi.return(record.bookId, record.id, Number(rating.toFixed(1)));
      if (id) {
        await dispatch(fetchUserBorrowingHistory(parseInt(id)));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to return book';
      setErrorMessage(message);
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  const currentBorrowings = borrowingHistory.filter(record => !record.returnDate);
  const pastBorrowings = borrowingHistory.filter(record => record.returnDate);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currently Borrowed Books
              </Typography>
              <List>
                {currentBorrowings.map((record) => (
                  <ListItem key={record.id}>
                    <ListItemText 
                      primary={record.book?.title}
                      secondary={`Borrowed on ${new Date(record.borrowDate).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleReturn(record)}
                      >
                        Return Book
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {currentBorrowings.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No books currently borrowed" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Past Borrowed Books
              </Typography>
              <List>
                {pastBorrowings.map((record) => (
                  <ListItem key={record.id}>
                    <ListItemText
                      primary={record.book?.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Rating 
                            value={record.rating ? Number(record.rating) : 0} 
                            readOnly 
                            precision={0.1} 
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({record.rating ? `${Number(record.rating).toFixed(1)}/5` : 'Not rated'})
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {pastBorrowings.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No borrowing history" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDetailsPage; 