import { t, useLocale } from "../../../i18n/locale";
import React from 'react';
import Container from '../Container';
import Divider from '../Divider';
import { InputField } from '../Fields';
import withSubscribe from '../Fields/HOC/withSubscribe';
import Logo from '../Logo';
const Footer = () => {
  useLocale();
  return <footer className='footer'>
      <Container>
        <div className='footer-wrapper'>
          <div className='footer-item footer-item--logo'>
            <div className='footer-logo'>
              <Logo />
              <p className='footer-logo__text'>{t("Toxin — комфортне проживання, прозорі ціни та зручне керування бронюваннями.")}</p>
            </div>
          </div>

          <div className='footer-item footer-item--newsletter'>
            <div className='footer-newsletter'>
              <p className='footer-newsletter__title'>{t("Ваше бронювання під контролем")}</p>
              <span>{t("Переглядайте дати, оплачуйте проживання та перевіряйте статус у своєму кабінеті.")}</span>
            </div>
          </div>
        </div>
      </Container>
      <Divider variant='fullWidth' className='footer-divider' />
      <Container>
        <div className='footer-bottom'>
          <p className='footer-copyright'>© {new Date().getFullYear()} Toxin Hotel</p>
          <span>{t("Бронювання · Онлайн-оплата · Особистий кабінет")}</span>
        </div>
      </Container>
    </footer>;
};
export default React.memo(Footer);
