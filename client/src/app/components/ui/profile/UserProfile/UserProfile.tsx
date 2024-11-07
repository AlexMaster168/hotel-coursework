import { Paper } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useMockData } from '../../../../hooks';
import { getUserById } from '../../../../store/users';
import { getDateDDMMYYYY } from '../../../../utils/formatDate';
import config from '../../../../config.json';

const UserProfile = ({ userId }: { userId: string }) => {
  const currentUser = useSelector(getUserById(userId));

  const { error, initialize, progress, status } = useMockData();

  const isFireBase = currentUser?.role === 'admin' && config.isFireBase;

  const handleClick = () => {
    initialize();
  };
  if (currentUser) {
    return (
      <main className='main-profile__page'>
        <h1 className='visually-hidden'>Профіль користувача готелю china-super</h1>
        <h2>Сторінка користувача {`${currentUser?.firstName} ${currentUser?.secondName}`}</h2>
        <div className='user-card'>
          <div>
            <img className='user-card__avatarPhoto' src={currentUser?.avatarPhoto} alt='avatarPhoto' />
          </div>
          <Paper className='user-card__content'>
            <p>Ім'я: {currentUser?.firstName}</p>
            <p>Прізвище: {currentUser?.secondName}</p>
            <p>Стать: {currentUser?.gender === 'male' ? 'Чоловіча' : 'Жіноча'}</p>
            <p>Статус: {currentUser?.role === 'admin' ? 'Адміністратор' : 'Користувач'}</p>
            <p>Дата народження: {getDateDDMMYYYY(currentUser?.birthYear || Date.now())}</p>
          </Paper>
        </div>

        {isFireBase && (
          <>
            <h3>Ініціалізація даних у FireBase</h3>
            <ul>
              <li>Статус: {status}</li>
              <li>Прогрес: {progress}%</li>
              {error && <li>error: {error}</li>}
            </ul>
            <button className='btn btn-primary' onClick={handleClick}>
                Ініціалізувати
            </button>
          </>
        )}
      </main>
    );
  }
  return (
    <main className='main-profile__page'>
      <h1 className='visually-hidden'>Профіль користувача готелю china-super</h1>
      <h2>Сторінку користувача не знайдено</h2>
    </main>
  );
};

export default UserProfile;
