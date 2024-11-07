import { Paper } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import LoginForm from '../../ui/forms/LoginForm';

const SignInPage: React.FC = () => {
  return (
    <>
      <h1 className='visually-hidden'>Готель China-Super Увійти до особистого кабінету</h1>
      <div className='login-form__wrapper'>
        <Paper elevation={3} className='form-card login-form__card'>
          <h2>Увійти</h2>
          <LoginForm />
          <div className='login-form__footer'>
            <span>Чи немає акаунту на China-Super?</span>
            <Link to='./signUp' className='login-form__link'>
              <Button variant='outlined' size='small'>
                Зареєструватись
              </Button>
            </Link>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default SignInPage;
