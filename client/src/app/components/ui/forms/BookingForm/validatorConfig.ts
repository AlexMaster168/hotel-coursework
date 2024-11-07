import { ValidatorConfigType } from '../../../../utils/validator';
import { BookingType } from './../../../../types/types';

type ConfigType = {
  [Property in keyof BookingType]?: ValidatorConfigType[Property];
};

const validatorConfig: ConfigType = {
  arrivalDate: {
    isValidDate: {
      message: 'Поле "Дата прибуття" не коректне',
    },
  },
  departureDate: {
    isValidDate: {
      message: 'Поле "Дата прибуття" не коректне',
    },
  },
};

export default validatorConfig;
