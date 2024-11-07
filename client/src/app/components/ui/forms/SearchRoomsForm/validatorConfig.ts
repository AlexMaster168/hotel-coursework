import { BookingType } from '../../../../types/types';
import { ValidatorConfigType } from '../../../../utils/validator';

type ConfigType = {
  [Property in keyof BookingType]?: ValidatorConfigType[Property];
};

const validatorConfig: ConfigType = {
  arrivalDate: {
    isValidDate: {
      message: 'Дата не коректна',
    },
  },
  departureDate: {
    isValidDate: {
      message: 'Дата не коректна',
    },
  },
  adults: {
    min: {
      message: 'Число дорослих гостей мінімум 1 дорослий',
      value: 2,
    },
  },
};

export default validatorConfig;
