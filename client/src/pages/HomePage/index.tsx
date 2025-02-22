import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { Person as PersonIcon, Book as BookIcon } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Library Management System
      </Typography>
      <Typography variant="body1" paragraph>
        Manage your library's books and users efficiently. Choose an option below to get started.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={() => navigate('/users')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Manage Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage library members, their borrowing history, and ratings
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={() => navigate('/books')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <BookIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Manage Books
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse books, check availability, and manage lending operations
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Tips
        </Typography>
        <Typography variant="body2" paragraph>
          • Click on a user to view their borrowing history and manage their books
        </Typography>
        <Typography variant="body2" paragraph>
          • Select a book to see its details, current borrower, and lending history
        </Typography>
        <Typography variant="body2" paragraph>
          • Use the navigation menu on the left to quickly switch between sections
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage; 