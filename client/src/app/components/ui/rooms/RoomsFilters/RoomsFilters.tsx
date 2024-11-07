import React, { useCallback } from 'react';
import { useFiltersQuery } from '../../../../hooks';
import Button from '../../../common/Button';
import { Checkbox, CheckBoxList, DateOfStayField, RangeSliderField } from '../../../common/Fields';
import GuestsCounter from '../../GuestsCounter/GuestsCounter';
import RoomsFilterList from './RoomsFiltersList/RoomsFiltersList';

const oneDayMs = 86000000;

const initialState = {
  arrivalDate: Date.now(),
  departureDate: Date.now() + oneDayMs,
  adults: 1,
  children: 0,
  babies: 0,
  price: [0, 15000],
  canSmoke: false,
  canPets: false,
  canInvite: false,
  hasWideCorridor: false,
  hasDisabledAssistant: false,
  hasWifi: false,
  hasConditioner: false,
  hasWorkSpace: false,
};

type RoomsFilterProps = {
  onReset: () => void;
};

const RoomsFilter: React.FC<RoomsFilterProps> = ({ onReset }) => {
  const { searchFilters, handleChangeFilter, handleResetSearchFilters } = useFiltersQuery();

  const handleResetFilters = useCallback(
    e => {
      e.preventDefault();
      handleResetSearchFilters();
      onReset();
    },
    [handleResetSearchFilters, onReset]
  );

  const data = { ...initialState, ...searchFilters };

  return (
    <section className='filters__wrapper'>
      <h2 className='visually-hidden'>Пошук номерів у готелі china-super</h2>
      <RoomsFilterList data={data} handleChange={handleChangeFilter}>
        <DateOfStayField data={data} onChange={handleChangeFilter} title='Дата перебування в готелі' />
        <GuestsCounter data={data} onChange={handleChangeFilter} />
        <RangeSliderField
          label='Діапазон ціни'
          description='Вартість за добу перебування у номері'
          name='price'
          onChange={handleChangeFilter}
          min={0}
          max={15000}
        />
        <CheckBoxList title='Зручності'>
          <Checkbox label='Wi-Fi' name='hasWifi' />
          <Checkbox label='Кондиціонер' name='hasConditioner' />
          <Checkbox label='Робоче місце' name='hasWorkSpace' />
        </CheckBoxList>
        <CheckBoxList title='Умови розміщення'>
          <Checkbox label='Можна з улюбленцями' name='canPets' />
          <Checkbox label='Можна палить' name='canSmoke' />
          <Checkbox label='Можна запросити гостей (до 10 осіб)' name='canInvite' />
        </CheckBoxList>
        <CheckBoxList title='Доступність'>
          <Checkbox
            label='Широкий коридор'
            name='hasWideCorridor'
            labelDetails='Ширина коридорів у номері не менше 91см'
          />
          <Checkbox
            label='Помічник для інвалідів'
            name='hasDisabledAssistant'
            labelDetails='На 1 поверсі вас зустріне фахівець та проводить до номера'
          />
        </CheckBoxList>
        <Button type='button' onClick={handleResetFilters} fullWidth>
          Скинути Фільтри
        </Button>
      </RoomsFilterList>
    </section>
  );
};

export default React.memo(RoomsFilter);
