import { Alert, Box } from '@mui/material';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
};

export default ErrorMessage; 