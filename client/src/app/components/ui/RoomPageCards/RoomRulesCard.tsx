import React from 'react';
import {t,useLocale} from '../../../i18n/locale';
import type {RoomType} from '../../../types/types';
export default function RoomRulesCard({room}:{room:RoomType}){
 useLocale();
 return <div className='room-info__card'><h3 className='room-info__card-title'>{t('Правила')}</h3><ul className='bullet-list'>
 <li className='bullet-list__item'>{t(room.canPets?'Можна з улюбленцями':'Не можна з улюбленцями')}</li>
 <li className='bullet-list__item'>{t(room.canSmoke?'Можна палити':'Паління заборонено')}</li>
 <li className='bullet-list__item'>{t('Без вечірок та заходів')}</li>
 <li className='bullet-list__item'>{t('Час прибуття – після 13:00, а виїзд до 12:00')}</li>
 </ul></div>;
}
