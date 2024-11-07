import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker, { DatePickerProps } from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';
import ukLocale from 'date-fns/locale/uk';
import React from 'react';

type DatePickerFieldProps = DatePickerProps & {
  label: string;
  value: Date | number;
  minDate: Date | number;
  name: string;
  error?: string;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({ label, name, value, minDate, onChange, error, ...rest }) => {
  const convertToDefEventParam = (name: string, value: Date | number | null) => ({
    target: {
      name,
      value: value ? new Date(Number(value)).getTime() : null,
    },
  });

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ukLocale}>
        <DatePicker
            mask="__.__.____"
            label={label}
            value={value}
            minDate={minDate || Date.now()}
            //@ts-ignore
            inputProps={{ placeholder: 'ДД.ММ.РРРР' }}
            onChange={(date: Date | any) => {
              onChange && onChange(convertToDefEventParam(name, date));
            }}
            //@ts-ignore
            renderInput={(params) => (
                <TextField {...params} {...(error && { error: true, helperText: error })} />
            )}
            {...rest}
        />
      </LocalizationProvider>
  );
};

export default React.memo(DatePickerField);
