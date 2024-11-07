import { ReviewType } from '../../../../types/types';
import { ValidatorConfigType } from '../../../../utils/validator';

type ConfigType = {
  [Property in keyof ReviewType]?: ValidatorConfigType[Property];
};

const validatorConfig: ConfigType = {
  content: {
    isRequired: { message: 'Поле "Повідомлення" не повинно бути порожнім' },
  },
};

export default validatorConfig;
