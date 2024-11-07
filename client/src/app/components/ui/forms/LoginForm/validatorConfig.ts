import { SignInDataType } from '../../../../types/types';
import { ValidatorConfigType } from '../../../../utils/validator';

type ConfigType = {
  [Property in keyof SignInDataType]?: ValidatorConfigType[Property];
};

const validatorConfig: ConfigType = {
  email: {
    isRequired: {
      message: 'Електронна пошта є обов\'язковою для заповнення',
    },
    isEmail: {
      message: 'Поле "Email" введено неправильно',
    },
  },
  password: {
    isRequired: {
      message: 'Поле "Пароль" є обов\'язковим для заповнення.',
    },
  },
};

export default validatorConfig;
