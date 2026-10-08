import { t, useLocale } from "../../../i18n/locale";
import React from 'react';
import { InputField } from '../Fields';
type SearchbarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const Searchbar: React.FC<SearchbarProps> = ({
  value,
  onChange
}) => {
  useLocale();
  return <InputField name='searchbar' label={t("Пошук")} placeholder={t("Пошук за номером...")} value={value} onChange={onChange} style={{
    flex: '1'
  }} />;
};
export default Searchbar;
