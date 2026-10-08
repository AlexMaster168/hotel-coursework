import { t, useLocale } from "../../../i18n/locale";
import { Paper } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import RegisterForm from '../../ui/forms/RegisterForm';
const SignUpPage: React.FC = () => {
  useLocale();
  return <>
      <h1 className='visually-hidden'>{t("Готель China-Super Реєстрація")}</h1>
      <div className='login-form__wrapper'>
        <Paper elevation={3} className='form-card login-form__card'>
          <h2>{t("Реєстрація")}</h2>
          <RegisterForm />
          <div className='login-form__footer'>
            <span>{t("Вже є обліковий запис China-Super?")}</span>
            <Link to='/login/signIn' className='login-form__link'>
              <Button variant='outlined' size='small'>{t("Увійти")}</Button>
            </Link>
          </div>
        </Paper>
      </div>
    </>;
};
export default SignUpPage;
