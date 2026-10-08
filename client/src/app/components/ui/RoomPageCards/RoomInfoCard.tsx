import React from 'react';
import { t, useLocale } from '../../../i18n/locale';
import type { RoomType } from '../../../types/types';
import WifiIcon from '@mui/icons-material/Wifi';
import ComputerIcon from '@mui/icons-material/Computer';
import AcUnitIcon from '@mui/icons-material/AcUnit';
const amenities=[{key:'hasWifi',title:'Wi-Fi',Icon:WifiIcon},{key:'hasWorkSpace',title:'Робоче місце',Icon:ComputerIcon},{key:'hasConditioner',title:'Кондиціонер',Icon:AcUnitIcon}];
export default function RoomInfoCard({room}:{room:RoomType}){
 useLocale();
 return <div className='room-info__card'><h3 className='room-info__card-title'>{t('Відомості про номер')}</h3><ul className='features-list'>
 {amenities.filter(item=>room.comforts?.includes(item.key)).map(({key,title,Icon})=><li className='features-list__item' key={key}><div className='feature'><Icon className='feature__icon'/><div className='feature-content'><div className='feature__title'>{t(title)}</div></div></div></li>)}
 </ul><p>{t('До 6 гостей · до 90 ночей')}</p></div>;
}
