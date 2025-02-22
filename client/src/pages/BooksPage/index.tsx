import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchBooks } from '../../redux/slices/booksSlice';
import { bookApi } from '../../services/api';
import { Book } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  quantity: number;
  availableQuantity?: number;
}

const initialFormData: BookFormData = {
  title: '',
  author: '',
  isbn: '',
  publishYear: 2024,
  quantity: 1,
};

const BooksPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state: RootState) => state.books);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleOpen = (book?: Book) => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishYear: book.publishYear,
        quantity: book.quantity,
        availableQuantity: book.availableQuantity,
      });
      setEditingBookId(book.id);
    } else {
      setFormData(initialFormData);
      setEditingBookId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setEditingBookId(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        availableQuantity: formData.availableQuantity ?? formData.quantity
      };

      if (editingBookId) {
        await bookApi.update(editingBookId, submitData);
      } else {
        await bookApi.create(submitData);
      }
      dispatch(fetchBooks());
      handleClose();
    } catch (error) {
      console.error('Failed to save book:', error);
    }
  };

  const handleDelete = async (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookApi.delete(bookId);
        dispatch(fetchBooks());
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h1>Books</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Book
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.availableQuantity} / {book.quantity}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleOpen(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(book.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingBookId ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Author"
            type="text"
            fullWidth
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <TextField
            margin="dense"
            label="ISBN"
            type="text"
            fullWidth
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Publish Year"
            type="number"
            fullWidth
            value={formData.publishYear}
            onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || 2024 })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
          />
          <TextField
            margin="dense"
            label="Available Quantity"
            type="number"
            fullWidth
            value={formData.availableQuantity}
            onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) || undefined })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BooksPage; 