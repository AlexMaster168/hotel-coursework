import React from 'react';
import Container from '../Container';
import Divider from '../Divider';
import { InputField } from '../Fields';
import withSubscribe from '../Fields/HOC/withSubscribe';
import Logo from '../Logo';

const Footer = () => {
  const SubscribeInput = withSubscribe(InputField);

  return (
    <footer className='footer'>
      <Container>
        <div className='footer-wrapper'>
          <div className='footer-item footer-item--logo'>
            <div className='footer-logo'>
              <Logo />
              <p className='footer-logo__text'>
                Бронювання номерів у найкращому готелі 2024 року за версією асоціації «Готельні погляди»
              </p>
            </div>
          </div>

          <div className='footer-item footer-item--newsletter'>
            <form className='footer-newsletter'>
              <p className='footer-newsletter__title'>Підписка</p>
              <span>Отримуйте спеціальні пропозиції та новини сервісу</span>
              <div className='footer-newsletter__input'>
                <SubscribeInput size='small' placeholder='Email' name='email' type='email' />
              </div>
            </form>
          </div>
        </div>
      </Container>
      <Divider variant='fullWidth' className='footer-divider' />
      <Container>
        <div className='footer-bottom'>
          <p className='footer-copyright'>Copyright © 2024 China-Super отель. Усі права захищені.</p>
          <span className='footer-social__link'>Povelunchuk</span>
        </div>
      </Container>
    </footer>
  );
};

export default React.memo(Footer);
