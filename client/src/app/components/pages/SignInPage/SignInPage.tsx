import { t, useLocale } from "../../../i18n/locale";
import { Paper } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import LoginForm from '../../ui/forms/LoginForm';
const SignInPage: React.FC = () => {
  useLocale();
  return <>
      <h1 className='visually-hidden'>{t("Готель China-Super Увійти до особистого кабінету")}</h1>
      <div className='login-form__wrapper'>
        <Paper elevation={3} className='form-card login-form__card'>
          <h2>{t("Увійти")}</h2>
          <LoginForm />
          <div className='login-form__footer'>
            <span>{t("Чи немає акаунту на China-Super?")}</span>
            <Link to='/login/signUp' className='login-form__link'>
              <Button variant='outlined' size='small'>{t("Зареєструватись")}</Button>
            </Link>
          </div>
        </Paper>
      </div>
    </>;
};
export default SignInPage;
