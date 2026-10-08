import { t, useLocale } from "../../../../i18n/locale";
import React, { useEffect } from 'react';
import { Alert, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/createStore';
import { loadBookingsList, getBookingsErrors } from '../../../../store/bookings';
import { useSelector } from 'react-redux';
import { getBookingsByUserId } from '../../../../store/bookings';
import { getCurrentUserId } from '../../../../store/users';
import BookingCard from '../../booking/BookingCard/BookingCard';
const ProfileBooking = () => {
  useLocale();
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const error = useSelector(getBookingsErrors());
  useEffect(() => {
    dispatch(loadBookingsList());
    if (params.get('payment') !== 'success') return;
    const timer = window.setInterval(() => dispatch(loadBookingsList()), 3000);
    const stop = window.setTimeout(() => window.clearInterval(timer), 30000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, [dispatch, params]);
  const currentUserId = useSelector(getCurrentUserId());
  const bookings = useSelector(getBookingsByUserId(currentUserId || 'not found'));
  return <div style={{
    width: '100%'
  }}>
      <h1 style={{
      marginBottom: '20px'
    }}>{t("Мої бронювання")}</h1>
      {params.get('payment') === 'success' && <Alert severity='info'>{t("Очікуємо підтвердження платежу. Статус оновиться після відповіді платіжного сервісу.")}</Alert>}
      {params.get('payment') === 'cancelled' && <Alert severity='warning'>{t("Оплату перервано. Бронювання збережено, можна спробувати ще раз.")}</Alert>}
      {error && <Alert severity='error'>{t(error)}</Alert>}
      <Button onClick={() => dispatch(loadBookingsList())}>{t("Оновити статус")}</Button>
      <div className='booking-list' style={{
      width: '100%'
    }}>
        {bookings.map(booking => <BookingCard key={booking._id} {...booking} />)}
        {bookings.length === 0 && <h3>{t("Список бронювань порожній")}</h3>}
      </div>
    </div>;
};
export default ProfileBooking;
