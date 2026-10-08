import { t, useLocale, getLocale, formatMoney } from "../../../../i18n/locale";
import { Paper, Box, Typography, Chip, Button, Alert } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getBookings, loadBookingsList } from '../../../../store/bookings';
import { useAppDispatch } from '../../../../store/createStore';
import { paymentService } from '../../../../services/payment.service';
import RoomsListTable from './RoomsListTable/RoomsListTable';
const AdminDashboard = () => {
  useLocale();
  const bookings = useSelector(getBookings());
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const active = bookings.filter(b => b.status !== 'cancelled');
  const revenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0);
  const refund = async (id: string) => {
    if (!window.confirm(t('Повернути повну суму та скасувати бронювання?'))) return;
    setBusy(id);
    setError('');
    try {
      const result = await paymentService.refund(id);
      if (result.status !== 'refunded') setError('Повернення обробляється. Оновіть статус пізніше.');
      await dispatch(loadBookingsList());
    } catch {
      setError('Не вдалося повернути кошти. Спробуйте ще раз.');
    } finally {
      setBusy('');
    }
  };
  return <div style={{
    width: '100%'
  }}>
      <Typography variant='h4' component='h1' gutterBottom>{t("Панель адміністратора")}</Typography>
      <Box sx={{
      display: 'flex',
      gap: 2,
      flexWrap: 'wrap',
      mb: 3
    }}>
        <Paper sx={{
        p: 3,
        flex: 1
      }}><Typography>{t("Активні бронювання")}</Typography><Typography variant='h4'>{active.length}</Typography></Paper>
        <Paper sx={{
        p: 3,
        flex: 1
      }}><Typography>{t("Отримані платежі")}</Typography><Typography variant='h4'>{formatMoney(revenue)}</Typography></Paper>
        <Paper sx={{
        p: 3,
        flex: 1
      }}><Typography>{t("Очікують оплати")}</Typography><Typography variant='h4'>{active.filter(b => b.paymentStatus !== 'paid').length}</Typography></Paper>
      </Box>
      {error && <Alert severity='warning'>{t(error)}</Alert>}
      <Paper sx={{
      p: 3,
      mb: 3
    }}>
        <Typography variant='h6'>{t("Бронювання та платежі")}</Typography>
        <Button onClick={() => dispatch(loadBookingsList())}>{t("Оновити")}</Button>
        {!bookings.length && <Typography>{t("Бронювань ще немає")}</Typography>}
        {bookings.map(b => <Box key={b._id} sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
        py: 2,
        borderBottom: '1px solid #eee'
      }}>
          <Typography sx={{
          flex: 1
        }}>№ {b._id?.slice(-6)} · {new Date(b.arrivalDate).toLocaleDateString(getLocale())} · {formatMoney(b.totalPrice)}</Typography>
          <Chip label={b.status === 'cancelled' ? t("Скасовано") : b.paymentStatus === 'paid' ? t("Оплачено") : t("Очікує оплати")} color={b.paymentStatus === 'paid' ? 'success' : 'default'} />
          {b.paymentStatus === 'paid' && <Button color='error' disabled={busy === b._id} onClick={() => refund(b._id!)}>{t("Повернути кошти")}</Button>}
        </Box>)}
      </Paper>
      <Paper sx={{
      width: '100%',
      mb: 2
    }}>
        <RoomsListTable />
      </Paper>
    </div>;
};
export default AdminDashboard;
