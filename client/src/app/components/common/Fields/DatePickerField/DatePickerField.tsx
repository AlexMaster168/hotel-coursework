import { getLanguage, t, useLocale } from '../../../../i18n/locale';
import React from 'react';
import { TextField } from '@mui/material';
type Props = { label:string; name:string; value:Date|number; minDate:Date|number; error?:string; onChange?:(event:any)=>void; renderInput?:(params:any)=>React.ReactNode };
const format=(value:Date|number)=>{const d=new Date(value);return Number.isNaN(+d)?'':`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export default React.memo(function DatePickerField({label,name,value,minDate,error,onChange}:Props){useLocale();return <TextField fullWidth type='date' label={label} name={name} value={format(value)} error={!!error} helperText={error ? t(error) : undefined} slotProps={{inputLabel:{shrink:true},htmlInput:{lang:getLanguage(),min:format(minDate||Date.now())}}} onChange={e=>onChange?.({target:{name,value:e.target.value?new Date(e.target.value+'T00:00:00').getTime():null}})}/>;});
