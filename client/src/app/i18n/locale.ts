import { useSyncExternalStore } from 'react';
import { english, ukrainian } from './messages';

export type Language = 'uk' | 'en';
const KEY = 'toxin-language';
const listeners = new Set<() => void>();
let language: Language = 'uk';
try { if (localStorage.getItem(KEY) === 'en') language = 'en'; } catch {}
export const getLanguage = () => language;
export const getLocale = () => language === 'uk' ? 'uk-UA' : 'en-GB';
function applyDocumentLanguage() {
  document.documentElement.lang = language;
  document.title = language === 'uk' ? 'Toxin — бронювання готелю' : 'Toxin — hotel booking';
  document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'uk' ? 'Toxin — пошук номерів, бронювання та онлайн-оплата проживання.' : 'Toxin — find rooms, book your stay and pay securely online.');
}
applyDocumentLanguage();
export function setLanguage(next: Language) {
  if (language === next) return;
  language = next;
  try { localStorage.setItem(KEY, next); } catch {}
  applyDocumentLanguage();
  listeners.forEach(listener => listener());
}
window.addEventListener('storage', event => {
  if (event.key === KEY) setLanguage(event.newValue === 'en' ? 'en' : 'uk');
});
export function useLocale() {
  return useSyncExternalStore(callback => { listeners.add(callback); return () => { listeners.delete(callback); }; }, getLanguage);
}
export function t(source: string, values: Record<string, string | number> = {}) {
  const key = source.trim().replace(/\s+/g, ' ');
  const text = (language === 'en' ? english[key] : ukrainian[key]) || key;
  return text.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}
export function formatMoney(amount: number) {
  return new Intl.NumberFormat(getLocale(), {style:'currency',currency:'UAH',maximumFractionDigits:2}).format(amount);
}
export function formatDate(value: string | number | Date) {
  const date = new Date(value);
  return Number.isFinite(+date) ? new Intl.DateTimeFormat(getLocale(), {day:'numeric',month:'long',year:'numeric'}).format(date) : '—';
}
export function reviewCount(count: number) {
  if (language === 'en') return `${count} ${count === 1 ? 'review' : 'reviews'}`;
  const forms: Record<Intl.LDMLPluralRule,string> = {one:'відгук',few:'відгуки',many:'відгуків',other:'відгуків',zero:'відгуків',two:'відгуки'};
  return `${count} ${forms[new Intl.PluralRules('uk').select(count)]}`;
}
