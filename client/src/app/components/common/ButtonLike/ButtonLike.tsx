import { t, useLocale } from "../../../i18n/locale";
import { IconButton, IconButtonProps } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../../../store/users';
type ButtonFavoriteProps = IconButtonProps & {
  displayCount: number;
  status: boolean;
  onToggle: () => void;
};
const ButtonLike: React.FC<ButtonFavoriteProps> = ({
  displayCount,
  status,
  onToggle
}) => {
  useLocale();
  const isLoggedIn = useSelector(getIsLoggedIn());
  return <IconButton aria-label='like' onClick={onToggle} className={status ? 'like-button like-button--active' : 'like-button'} disableRipple disabled={!isLoggedIn}>
      <div className='like-button__wrapper'>
        <span className='visually-hidden'>{t("Кількість лайків:")}</span>
        {status ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        {displayCount}
      </div>
    </IconButton>;
};
export default ButtonLike;
