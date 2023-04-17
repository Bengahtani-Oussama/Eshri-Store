const { createTheme } = require('@mui/material');

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 320,
      md: 700,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
