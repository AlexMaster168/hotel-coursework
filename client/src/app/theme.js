import { createTheme } from '@mui/material/styles';
import { ukUA, enUS } from '@mui/material/locale';
export const createHotelTheme = language => createTheme(
  {
    typography: {
      fontFamily: "'Montserrat', sans-serif !important",
      fontSize: 14,
    },
  },
  language === 'en' ? enUS : ukUA
);
