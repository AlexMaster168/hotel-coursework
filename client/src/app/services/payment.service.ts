import http from './http.service';
import { getLanguage } from '../i18n/locale';
export const paymentService = {
  async config(): Promise<{enabled:boolean}> { return (await http.get('payments/config')).data.content; },
  async checkout(bookingId:string) { const {data} = await http.post(`payments/checkout/${bookingId}`, {language:getLanguage()}); window.location.assign(data.content.url); },
  async refund(bookingId:string) { return (await http.post(`payments/refund/${bookingId}`)).data.content; },
};
