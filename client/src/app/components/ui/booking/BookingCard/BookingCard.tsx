import { t, useLocale, formatMoney } from "../../../../i18n/locale";
import { useAppDispatch } from '../../../../store/createStore';
import { Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Alert, Chip } from '@mui/material';
import { paymentService } from '../../../../services/payment.service';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeBooking } from '../../../../store/bookings';
import { getRoomById, removeBookingRoom } from '../../../../store/rooms';
import { BookingType } from '../../../../types/types';
import { getDateDDMMYYYY } from '../../../../utils/formatDate';
import Button from '../../../common/Button';
import { getGuestsLabel } from '../../GuestsCounter/GuestsCounter';
import RoomCard from '../../rooms/RoomCard';
const BookingCard: React.FC<BookingType> = ({
  _id,
  arrivalDate,
  departureDate,
  adults,
  children,
  babies,
  totalPrice,
  roomId,
  status = 'confirmed',
  paymentStatus = 'unpaid'
}) => {
  useLocale();
  const dispatch = useAppDispatch();
  const room = useSelector(getRoomById(roomId));
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    paymentService.config().then(config => setPaymentsEnabled(config.enabled)).catch(() => {});
  }, []);
  const pay = async () => {
    setBusy(true);
    setError('');
    try {
      await paymentService.checkout(_id!);
    } catch {
      setError('Не вдалося відкрити оплату. Спробуйте пізніше.');
      setBusy(false);
    }
  };
  const handleRemoveBooking = () => {
    dispatch(removeBooking(_id));
  };
  return <Paper className='booking-card'>
      <div className='booking-card__wrapper'>
        <div className='booking-content'>
          <h2>
            № <span>{_id}</span>
          </h2>
          <h3 className='booking-info__title'>{t("Інформація про бронювання")}</h3>
          <Chip label={status === 'cancelled' ? t("Скасовано") : paymentStatus === 'paid' ? t("Оплачено") : paymentStatus === 'refunded' ? t("Кошти повернуто") : t("Підтверджено · очікує оплати")} color={paymentStatus === 'paid' ? 'success' : 'default'} />
          {error && <Alert severity='error'>{t(error)}</Alert>}
          <table className='booking-info'>
            <tbody className='booking-info__body'>
              <tr className='booking-info__item'>
                <td>{t("Дата прибуття:")}</td>
                <td>
                  <span>{`${getDateDDMMYYYY(arrivalDate)}`}</span>
                </td>
              </tr>
              <tr className='booking-info__item'>
                <td>{t("Дата виїзду:")}</td>
                <td>
                  <span>{`${getDateDDMMYYYY(departureDate)}`}</span>
                </td>
              </tr>
              <tr className='booking-info__item'>
                <td>{t("Кількість гостей:")}</td>
                <td>
                  <span>{getGuestsLabel(adults, children, babies)}</span>
                </td>
              </tr>
              <tr className='booking-info__item'>
                <td>{t("Вартість бронювання:")}</td>
                <td>
                  <span>{formatMoney(totalPrice)}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='booking-card__btns'>
          <div style={{
          width: '100%'
        }}>
            <RoomCard _id={room?._id || 'id not found'} roomNumber={room?.roomNumber || 'not found'} price={room?.price || 0} type={room?.type} images={room?.images} comforts={room?.comforts} />
          </div>
          <Link to={`/rooms/${roomId}`}>
            <Button size='small' fullWidth>{t("Перейти на сторінку номера")}</Button>
          </Link>
          {status !== 'cancelled' && paymentStatus === 'unpaid' && (paymentsEnabled ? <Button onClick={pay} disabled={busy}>{busy ? t("Відкриваємо оплату…") : t("Оплатити онлайн")}</Button> : <Alert severity='info'>{t("Онлайн-оплата поки недоступна. Оплата під час заселення.")}</Alert>)}
          {status !== 'cancelled' && paymentStatus !== 'paid' && <Button size='small' variant='outlined' color='error' onClick={handleRemoveBooking}>{t("Скасувати бронювання")}</Button>}
          {paymentStatus === 'paid' && <Alert severity='info'>{t("Для скасування та повернення коштів зверніться до адміністратора.")}</Alert>}
        </div>
      </div>
    </Paper>;
};
export default BookingCard;
