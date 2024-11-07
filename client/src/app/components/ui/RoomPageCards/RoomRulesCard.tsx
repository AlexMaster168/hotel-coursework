import React from 'react';

const RoomRulesCard = () => {
  return (
    <div className='room-info__card'>
      <h3 className='room-info__card-title'>Правила</h3>
      <ul className='bullet-list'>
        <li className='bullet-list__item'>Не можна з улюбленцями</li>
        <li className='bullet-list__item'>Без вечірок та заходів</li>
        <li className='bullet-list__item'>Час прибуття – після 13:00, а виїзд до 12:00</li>
      </ul>
    </div>
  );
};

export default RoomRulesCard;
