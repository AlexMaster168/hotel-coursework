import { Paper } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import RegisterForm from '../../ui/forms/RegisterForm';

const SignUpPage: React.FC = () => {
  return (
    <>
      <h1 className='visually-hidden'>Готель China-Super Реєстрація</h1>
      <div className='login-form__wrapper'>
        <Paper elevation={3} className='form-card login-form__card'>
          <h2>Реєстрація</h2>
          <RegisterForm />
          <div className='login-form__footer'>
            <span>Вже є обліковий запис China-Super?</span>
            <Link to='./signIn' className='login-form__link'>
              <Button variant='outlined' size='small'>
                Увійти
              </Button>
            </Link>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default SignUpPage;
