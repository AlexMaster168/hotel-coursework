import { t, useLocale } from "../../../../i18n/locale";
import React from 'react';
import localStorageService from '../../../../services/localStorage.service';
import { getRoomsByIds } from '../../../../store/rooms';
import { useSelector } from 'react-redux';
import RoomsList from '../../rooms/RoomsList/RoomsList';
const ProfileFavorites = () => {
  useLocale();
  const favoritesRoomIds: string[] = JSON.parse(localStorageService.getFavoritesRoom() || '{}');
  const rooms = useSelector(getRoomsByIds(favoritesRoomIds));
  return <div style={{
    width: '100%'
  }}>
      <h1 style={{
      marginBottom: '20px'
    }}>{t("Мої улюблені номери")}</h1>
      {rooms.length > 0 ? <RoomsList rooms={rooms} /> : <h3>{t("Список порожній")}</h3>}
    </div>;
};
export default ProfileFavorites;
