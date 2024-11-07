import { UserType } from '../../../../types/types';
import { ValidatorConfigType } from '../../../../utils/validator';

type ConfigType = {
  [Property in keyof UserType]?: ValidatorConfigType[Property];
};

const validatorConfig: ConfigType = {
  firstName: {
    isRequired: {
      message: 'Поле "Ім’я" є обов’язковим для заповнення',
    },
  },
  secondName: {
    isRequired: {
      message: 'Поле "Прізвище" є обов’язковим для заповнення',
    },
  },
  email: {
    isRequired: {
      message: 'Електронна пошта є обов’язковою для заповнення',
    },
    isEmail: {
      message: 'Поле "Email" введено некоректно',
    },
  },
  password: {
    isRequired: {
      message: 'Поле "Пароль" є обов’язковим для заповнення',
    },
    isCapitalSymbol: {
      message: 'Пароль має містити хоча б одну велику літеру',
    },
    isContainDigit: {
      message: 'Пароль має містити хоча б одну цифру',
    },
    min: {
      value: 8,
      message: 'Пароль має містити щонайменше 8 символів',
    },
  },
};

export default validatorConfig;
