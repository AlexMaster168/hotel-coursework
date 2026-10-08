import { t, useLocale } from '../../../../i18n/locale';
import React from 'react';
import { TextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

type InputTypes = {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  error?: string | null;
  autoFocus?: boolean;
} & Omit<MuiTextFieldProps, 'error'>;

const InputField: React.FC<InputTypes> = ({ label, type = 'text', name, value, onChange, error = null, ...rest }) => {
  useLocale();
  return (
    <TextField
      variant='outlined'
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      {...rest}
      {...(error ? { error: true, helperText: t(error) } : {})}
    />
  );
};

export default React.memo(InputField);
