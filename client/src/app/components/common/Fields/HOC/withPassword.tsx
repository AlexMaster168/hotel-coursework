import { IconButton, InputAdornment } from '@mui/material';
import { t, useLocale } from '../../../../i18n/locale';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material';

type InjectedProps = {};

const withPassword =
  <P extends InjectedProps>(Component: React.ComponentType<P>) =>
  (props: MuiTextFieldProps) => {
    useLocale();
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(prevState => !prevState);
    };

    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    };

    return (
      <Component
        {...(props as P)}
        type={showPassword ? 'text' : 'password'}
        slotProps={{ input: {
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label={t(showPassword ? 'Приховати пароль' : 'Показати пароль')}
                onClick={toggleShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        } }}
      />
    );
  };

export default withPassword;
