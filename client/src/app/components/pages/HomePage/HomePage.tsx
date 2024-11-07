import { Paper } from '@mui/material';
import React from 'react';
import Container from '../../common/Container';
import { SearchRoomsForm } from '../../ui/forms';

const HomePage: React.FC = () => {
  return (
    <main className='main-home__page'>
      <Container>
        <div className='main-home__wrapper'>
          <h1 className='visually-hidden'>Пошук номерів у готелі china-super</h1>
          <Paper elevation={3} className='form-card searchRooms-form'>
            <h2>Знайдемо номери під ваші побажання</h2>
            <SearchRoomsForm />
          </Paper>
          <p className='main__text-wishes'>Найкращі номери для вашої роботи, відпочинку та просто натхнення</p>
        </div>
      </Container>
    </main>
  );
};

export default HomePage;
