import React from 'react';
import {Paper} from '@mui/material';
import {useSelector} from 'react-redux';
import {getUserById} from '../../../../store/users';
import {t,useLocale,formatDate} from '../../../../i18n/locale';
export default function UserProfile({userId}:{userId:string}){
 useLocale();const user=useSelector(getUserById(userId));
 if(!user)return <main><h2>{t('Сторінку користувача не знайдено')}</h2></main>;
 return <main className='main-profile__page'><h2>{t('Мій профіль')}</h2><Paper className='user-card__content' sx={{p:3,mt:2}}>
 <p>{t("Ім'я:")} {user.firstName}</p><p>{t('Прізвище:')} {user.secondName}</p>
 {user.gender&&<p>{t('Стать:')} {t(user.gender==='male'?'Чоловіча':'Жіноча')}</p>}
 {user.role&&<p>{t('Статус:')} {t(user.role==='admin'?'Адміністратор':'Користувач')}</p>}
 {user.birthYear&&<p>{t('Дата народження:')} {formatDate(user.birthYear)}</p>}
 </Paper></main>;
}
