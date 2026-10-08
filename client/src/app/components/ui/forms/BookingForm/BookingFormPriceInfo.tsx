import { t, useLocale, formatMoney } from "../../../../i18n/locale";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getRoomById } from '../../../../store/rooms';
import Tooltip from '../../../common/Tooltip/Tooltip';
type Props = {
  roomId: string;
  countDays: number;
  setTotalPrice: (value: number) => void;
  totalPrice: number;
};
const BookingFormPriceInfo: React.FC<Props> = ({
  roomId,
  countDays,
  setTotalPrice,
  totalPrice
}) => {
  useLocale();
  const {
    price
  } = useSelector(getRoomById(roomId)) || {
    price: 0
  };
  const DISCOUNT_PERCENT = 10;
  const PRICE_SERVICE = 300;
  const PRICE_RENT = price * countDays;
  const PRICE_RENT_WITH_DISCOUNT = price * countDays * DISCOUNT_PERCENT / 100;
  const getTotalPrice = () => {
    return PRICE_RENT - PRICE_RENT_WITH_DISCOUNT + PRICE_SERVICE;
  };
  useEffect(() => {
    const totalPrice = getTotalPrice();
    setTotalPrice(totalPrice);
  }, [countDays, price]);
  return <div className='booking-form__price'>
      <div className='booking-form__price-item'>
        <div className='price-item__result'>
          <span>{t("{v0}₴ x {v1} діб", {
            v0: price,
            v1: countDays
          })}</span>
          <span>{formatMoney(PRICE_RENT)}</span>
        </div>
      </div>
      <div className='booking-form__price-item'>
        <div className='price-item__with-tooltip'>
          <span>{t("Збір за послуги: знижка")} {DISCOUNT_PERCENT}%</span>
          <Tooltip title={t("Знижка на першу броню")}>
            <InfoOutlinedIcon className='booking-form__tooltip-icon' />
          </Tooltip>
        </div>

        <span>{formatMoney(-PRICE_RENT_WITH_DISCOUNT)}</span>
      </div>
      <div className='booking-form__price-item'>
        <div className='price-item__with-tooltip'>
          <span>{t("Збір за дод. послуги")}</span>
          <Tooltip title={t("Чайові для персоналу вже включені до рахунку")}>
            <InfoOutlinedIcon className='booking-form__tooltip-icon' />
          </Tooltip>
        </div>
        <span>{formatMoney(PRICE_SERVICE)}</span>
      </div>
      <div className='booking-form__price-item'>
        <div className='price-item__totalPrice'>
          <span className='totalPrice__text'>{t("Разом")}</span>
          <span className='totalPrice__dots'></span>
          <span className='totalPrice__cell'>{formatMoney(totalPrice)}</span>
        </div>
      </div>
    </div>;
};
export default BookingFormPriceInfo;
