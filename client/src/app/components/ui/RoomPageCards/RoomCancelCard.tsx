import { t, useLocale } from "../../../i18n/locale";
import React from 'react';
const RoomCancelCard = () => {
  useLocale();
  return <div className='room-info__card'>
      <h3 className='room-info__card-title'>{t("Скасування")}</h3>
      <p>{t("Неоплачене бронювання можна скасувати в особистому кабінеті. Для скасування оплаченого проживання зверніться до адміністратора: він оформить повне повернення коштів.")}</p>
    </div>;
};
export default RoomCancelCard;
