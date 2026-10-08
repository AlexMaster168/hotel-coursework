import { t, useLocale } from "../../../../i18n/locale";
import React from 'react';
import DatePickerField from '../DatePickerField';
const oneDayMs = 86_400_000;
type DateOfStayProps = {
  data: any;
  errors?: {
    [x: string]: string;
  };
  onChange: (target: any) => void;
  title?: string;
};
const DateOfStay: React.FC<DateOfStayProps> = ({
  onChange,
  data,
  errors
}) => {
  useLocale();
  const {
    arrivalDate,
    departureDate
  } = data;
  return <div className='dateOfStay-wrapper'>
      <div className='dateOfStay'>
        <DatePickerField label={t("Дата прибуття")} name='arrivalDate' minDate={Date.now()} onChange={onChange} value={+arrivalDate} error={errors?.arrivalDate} />
      </div>
      <div className='dateOfStay'>
        <DatePickerField label={t("Дата виїзду")} name='departureDate' minDate={+arrivalDate + oneDayMs} onChange={onChange} value={+departureDate} error={errors?.departureDate} />
      </div>
    </div>;
};
export default DateOfStay;
