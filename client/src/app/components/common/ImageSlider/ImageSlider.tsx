import { t, useLocale } from "../../../i18n/locale";
import React, { useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
type Props = {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
};
export default function ImageSlider({
  children,
  className = ''
}: Props) {
  useLocale();
  const slides = React.Children.toArray(children);
  const [index, setIndex] = useState(0);
  return <div className={className + ' gallery'} aria-roledescription={t("карусель")}>
  <div className='gallery-slide'>{slides[index % Math.max(1, slides.length)]}</div>
  {slides.length > 1 && <><button type='button' className='gallery-prev' aria-label={t("Попереднє фото")} onClick={() => setIndex((index + slides.length - 1) % slides.length)}><ChevronLeftIcon /></button><button type='button' className='gallery-next' aria-label={t("Наступне фото")} onClick={() => setIndex((index + 1) % slides.length)}><ChevronRightIcon /></button><span className='gallery-count'>{index + 1} / {slides.length}</span></>}
 </div>;
}
