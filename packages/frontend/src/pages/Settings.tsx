import { Box, Typography } from '@mui/material';

export const Settings = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Coming Soon
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Settings page is under development
      </Typography>
    </Box>
  );
};

export default Settings;
