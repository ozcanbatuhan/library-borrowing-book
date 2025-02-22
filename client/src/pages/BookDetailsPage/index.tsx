import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchBookById } from '../../redux/slices/booksSlice';
import { fetchUsers } from '../../redux/slices/usersSlice';
import { borrowingApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BorrowingRecord, User } from '../../types';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedBook: book, loading: bookLoading, error: bookError } = useAppSelector(
    (state: RootState) => state.books
  );
  const { users, loading: usersLoading } = useAppSelector(
    (state: RootState) => state.users
  );
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [disabledUsers, setDisabledUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(parseInt(id)));
      dispatch(fetchUsers());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (book?.borrowingHistory) {
      const currentlyBorrowing = new Set<number>();
      book.borrowingHistory.forEach((record: BorrowingRecord) => {
        if (!record.returnDate && record.userId) {
          currentlyBorrowing.add(record.userId);
        }
      });
      setDisabledUsers(currentlyBorrowing);
    }
  }, [book?.borrowingHistory]);

  const isUserDisabled = (userId: number) => {
    return disabledUsers.has(userId);
  };

  const handleOpen = () => {
    setOpen(true);
    setSelectedUserId('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId('');
  };

  const handleBorrow = async () => {
    if (!id || !selectedUserId) return;

    try {
      await borrowingApi.borrow(parseInt(selectedUserId), parseInt(id));
      await dispatch(fetchBookById(parseInt(id)));
      setOpen(false);
      setSelectedUserId('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to borrow book';
      setErrorMessage(message);
      setShowError(true);
    }
  };

  const handleReturn = async (borrowingRecord: BorrowingRecord) => {
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

      await borrowingApi.return(borrowingRecord.bookId, borrowingRecord.id, Number(rating.toFixed(1)));
      if (id) {
        await dispatch(fetchBookById(parseInt(id)));
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

  if (bookLoading || usersLoading) return <LoadingSpinner />;
  if (bookError) return <ErrorMessage message={bookError} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/books')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Book Details</Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Title
              </Typography>
              <Typography variant="h6">{book.title}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Author
              </Typography>
              <Typography variant="h6">{book.author || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                ISBN
              </Typography>
              <Typography variant="h6">{book.isbn || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Publish Year
              </Typography>
              <Typography variant="h6">{book.publishYear || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Availability
              </Typography>
              <Typography variant="h6">
                {book.availableQuantity || 0} of {book.quantity || 0} available
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={book.averageRating === null || book.averageRating === -1 ? 0 : Number(book.averageRating)}
                  readOnly
                  precision={0.1}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {book.averageRating === null || book.averageRating === -1
                    ? 'No ratings yet'
                    : `(${Number(book.averageRating).toFixed(2)})`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Currently Borrowed By
              </Typography>
              {book.currentBorrowers.length > 0 ? (
                book.currentBorrowers.map((borrower, index) => (
                  <Typography key={borrower.id} variant="h6">
                    {`${borrower.firstName} ${borrower.lastName}`}
                    {index < book.currentBorrowers.length - 1 ? ', ' : ''}
                  </Typography>
                ))
              ) : (
                <Typography variant="h6">Not currently borrowed</Typography>
              )}
            </Grid>
          </Grid>

          {(book.availableQuantity || 0) > 0 && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleOpen}
            >
              Borrow Book
            </Button>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Borrowing History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {book.borrowingHistory?.map((record: BorrowingRecord) => (
              <TableRow key={record.id}>
                <TableCell>
                  {record.user
                    ? `${record.user.firstName} ${record.user.lastName}`
                    : 'Unknown User'}
                </TableCell>
                <TableCell>
                  {new Date(record.borrowDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {record.returnDate
                    ? new Date(record.returnDate).toLocaleDateString()
                    : 'Not returned'
                  }
                </TableCell>
                <TableCell>
                  {record.rating ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating 
                        value={Number(record.rating)} 
                        readOnly 
                        precision={0.1} 
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({Number(record.rating).toFixed(1)})
                      </Typography>
                    </Box>
                  ) : (
                    'Not rated'
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!book.borrowingHistory || book.borrowingHistory.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No borrowing history
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              label="Select User"
            >
              {users.map((user: User) => (
                <MenuItem 
                  key={user.id} 
                  value={user.id}
                  disabled={isUserDisabled(user.id)}
                  sx={{
                    '&.Mui-disabled': {
                      opacity: 0.7,
                      '& .MuiListItemText-root': {
                        color: 'text.disabled',
                      },
                      '&::after': {
                        content: '"(Already borrowed)"',
                        marginLeft: '8px',
                        fontSize: '0.75rem',
                        color: 'error.main',
                      },
                    },
                  }}
                >
                  {`${user.firstName} ${user.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleBorrow}
            variant="contained"
            color="primary"
            disabled={!selectedUserId || isUserDisabled(parseInt(selectedUserId))}
          >
            Borrow
          </Button>
        </DialogActions>
      </Dialog>

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

export default BookDetailsPage; 