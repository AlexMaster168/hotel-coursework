import React from 'react';
import { SelectField } from '../../../common/Fields';

const roomsSortArray = [
  { name: 'За спаданням', value: { path: 'roomNumber', order: 'desc' } },
  { name: 'За зростанням', value: { path: 'roomNumber', order: 'asc' } },
  { name: 'Популярне', value: { path: 'countReviews', order: 'desc' } },
  { name: 'Високий рейтинг', value: { path: 'rate', order: 'desc' } },
  { name: 'Спершу дешеві', value: { path: 'price', order: 'asc' } },
  { name: 'Спочатку дорогі', value: { path: 'price', order: 'desc' } },
];

type RoomsSortProps = {
  sortBy: { path: string; order: 'asc' | 'desc' };
  onSort: (event: any) => void;
};

const RoomsSort: React.FC<RoomsSortProps> = ({ sortBy, onSort }) => {
  return (
    <SelectField
      name='roomSort'
      style={{ minWidth: '200px' }}
      label='Сортувати'
      value={JSON.stringify(sortBy)}
      onChange={onSort}
      options={roomsSortArray}
    />
  );
};

export default RoomsSort;
