import { t, useLocale } from "../../../i18n/locale";
import React from 'react';
import history from '../../../utils/history';
import Button from '../../common/Button';
import Container from '../../common/Container';
import Footer from '../../common/Footer';
import Header from '../../common/Header';
const Page404 = () => {
  useLocale();
  const handleGoHome = () => {
    history.push('/');
  };
  return <>
      <Header />
      <Container>
        <main className='main-page404'>
          <h2 className='page404__title'>{t("404 Сторінку не знайдено :(")}</h2>
          <Button className='page404__button' onClick={handleGoHome}>{t("На головну")}</Button>
        </main>
      </Container>
      <Footer />
    </>;
};
export default Page404;
