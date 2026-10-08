import { t, useLocale, getLanguage } from "../../../i18n/locale";
import React from 'react';
import Counter from '../../common/Counter';
import declOfNum from '../../../utils/declOfNum';
export const getGuestsLabel = (adults: number, children: number, babies: number) => {
  const guests = [Number(adults), Number(children), Number(babies)];
  const countGuests = guests.reduce((acc, cur) => acc + cur, 0);
  const countBabies = Number(babies);
  const guestsStr = getLanguage() === 'en' ? `${countGuests} ${countGuests === 1 ? 'guest' : 'guests'}` : `${countGuests} ${declOfNum(countGuests, ['гість', 'гості', 'гостей'])}`;
  const babiesStr = getLanguage() === 'en' ? `${countBabies} ${countBabies === 1 ? 'infant' : 'infants'}` : `${countBabies} ${declOfNum(countBabies, ['немовля', 'немовляти', 'немовлят'])}`;
  if (countGuests > 0 && countBabies > 0) {
    return `${guestsStr}, ${babiesStr}`;
  }
  return countGuests > 0 ? guestsStr : t('Скільки гостей');
};
type GuestsCounterProps = {
  data: {
    adults: number;
    children: number;
    babies: number;
  };
  onChange: ({
    target
  }: any) => void;
};
const GuestsCounter: React.FC<GuestsCounterProps> = ({
  data,
  onChange
}) => {
  useLocale();
  const {
    adults,
    children,
    babies
  } = data;
  return <>
      <p className='guests-label'>{getGuestsLabel(adults, children, babies)}</p>
      <Counter name='adults' label={t("Дорослих")} min={1} max={6-Number(children)-Number(babies)} onChange={onChange} value={+adults} />
      <Counter name='children' label={t("Дітей")} min={0} max={6-Number(adults)-Number(babies)} onChange={onChange} value={children} />
      <Counter name='babies' label={t("Немовлят")} min={0} max={6-Number(adults)-Number(children)} onChange={onChange} value={+babies} />
    </>;
};
export default React.memo(GuestsCounter);
