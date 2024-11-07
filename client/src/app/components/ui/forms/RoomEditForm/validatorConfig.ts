import { RoomType } from './../../../../types/types';
import { ValidatorConfigType } from '../../../../utils/validator';

type ConfigType = {
  [Property in keyof RoomType]?: ValidatorConfigType[Property];
};

const validatorConfig: ConfigType = {
  roomNumber: {
    isRequired: {
      message: 'Поле "№ номера" є обов\'язковим для заповнення',
    },
  },
  price: {
    isRequired: {
      message: 'Поле "Оренда за добу" обов\'язково для заповнення',
    },
    isValidInterval: {
      message: 'Введіть ціну від 0 до 15000',
      value: [0, 15000],
    },
  },
};

export default validatorConfig;
