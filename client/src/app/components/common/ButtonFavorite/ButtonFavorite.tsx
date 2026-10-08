import { t, useLocale } from "../../../i18n/locale";
import { IconButton, IconButtonProps } from '@mui/material';
import React from 'react';
import Tooltip from '../Tooltip';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutlineRounded';
type ButtonFavoriteProps = IconButtonProps & {
  status: boolean;
  onToggle: () => void;
};
const ButtonFavorite: React.FC<ButtonFavoriteProps> = ({
  status,
  onToggle
}) => {
  useLocale();
  return <Tooltip title={status ? t("Видалити з вибраного") : t("Додати до обраного")}>
      <IconButton className='room-page__favoriteBtn' size='large' onClick={onToggle}>
        {status ? <StarIcon /> : <StarOutlineIcon />}
      </IconButton>
    </Tooltip>;
};
export default ButtonFavorite;
