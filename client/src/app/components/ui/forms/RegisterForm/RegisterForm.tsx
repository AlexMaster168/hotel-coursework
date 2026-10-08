import { t, useLocale } from "../../../../i18n/locale";
import { useAppDispatch } from '../../../../store/createStore';
import { TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useForm } from '../../../../hooks';
import { getAuthErrors, signUp } from '../../../../store/users';
import { UserType } from '../../../../types/types';
import Button from '../../../common/Button/Button';
import { DatePickerField, InputField, RadioGroup } from '../../../common/Fields';
import withPassword from '../../../common/Fields/HOC/withPassword';
import Switch from '../../../common/Switch';
import validatorConfig from './validatorConfig';
const genderItems = [{
  id: 'male',
  title: 'Чоловік'
}, {
  id: 'female',
  title: 'Жінка'
}];
const initialData: UserType = {
  firstName: '',
  secondName: '',
  gender: 'male',
  role: 'user',
  birthYear: Date.now(),
  email: '',
  password: '',
  subscribe: false
};
const RegisterForm = () => {
  useLocale();
  const {
    data,
    errors,
    handleInputChange,
    handleKeyDown,
    validate
  } = useForm(initialData, true, validatorConfig);
  const loginError = useSelector(getAuthErrors());
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validate(data)) {
      dispatch(signUp(data));
    }
  };
  const InputFieldWithPassword = useMemo(() => withPassword(InputField), []);
  return <>
      <Form data={data} errors={errors} handleChange={handleInputChange} handleKeyDown={handleKeyDown}>
        <InputField autoFocus name='firstName' label={t("Ім'я")} />
        <InputField name='secondName' label={t("Прізвище")} />
        <RadioGroup name='gender' items={genderItems} />
        <DatePickerField value={data.birthYear} onChange={handleInputChange} label={t("Дата Народження")} name='birthYear' minDate={new Date('1950-01-01')} renderInput={params => <TextField {...params} {...errors?.birthYear && {
        error: true,
        helperText: errors?.birthYear
      }} />} />
        <InputField name='email' label={t("Пошта")} />
        <InputFieldWithPassword name='password' label={t("Пароль")} type='password' />
        <Switch name='subscribe' label={t("Отримувати спецпропозиції")} onChange={handleInputChange} />
        <Button type='submit' onClick={handleSubmit} fullWidth disabled={Object.keys(errors).length !== 0}>{t("Зареєструватись")}</Button>
      </Form>
      {loginError && <p className='form__enter-error'>{t(loginError)}</p>}
    </>;
};
export default RegisterForm;
