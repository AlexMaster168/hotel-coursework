import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import AppLoader from './components/ui/HOC/AppLoader';
import AppRouter from './router/AppRouter';
import './scss/app.scss';
import { createHotelTheme } from './theme';
import { useLocale } from './i18n/locale';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  const language = useLocale();
  const theme = useMemo(() => createHotelTheme(language), [language]);
  return (
    <ErrorBoundary><AppLoader>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
      <ToastContainer />
    </AppLoader></ErrorBoundary>
  );
};

export default App;
