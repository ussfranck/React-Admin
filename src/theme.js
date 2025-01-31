import { defaultTheme } from 'react-admin';

export const myTheme = {
  ...defaultTheme,
  components: {
      MuiDrawer: { // Sidebar
          styleOverrides: {
              paper: {
                  backgroundColor: '#1e88e5',
                  width: {
                      xs: '100%',
                      sm: 240,
                      md: 280
                  }
              }
          }
      },
      MuiAppBar: { // Navbar
          styleOverrides: {
              root: {
                  backgroundColor: '#1976d2'
              }
          }
      }
  }
};