import { getLocale, formatDate as formatCalendarDate } from '../i18n/locale';
export function decomposeDate(value:number|Date|string){const d=new Date(value);return {date:+d,year:d.getFullYear(),month:d.getMonth(),day:d.getDate(),hours:d.getHours(),min:d.getMinutes()};}
export const getDateDDMMYYYY = formatCalendarDate;
export default function formatDate(value:number|Date|string){
 const d=new Date(value);if(!Number.isFinite(+d))return '—';
 const seconds=Math.round((+d-Date.now())/1000);
 const relative=new Intl.RelativeTimeFormat(getLocale(),{numeric:'auto'});
 if(Math.abs(seconds)<60)return relative.format(0,'second');
 if(Math.abs(seconds)<3600)return relative.format(Math.round(seconds/60),'minute');
 if(Math.abs(seconds)<86400)return relative.format(Math.round(seconds/3600),'hour');
 if(Math.abs(seconds)<604800)return relative.format(Math.round(seconds/86400),'day');
 return formatCalendarDate(value);
}
