import { setLanguage, useLocale } from '../../i18n/locale';

export default function LanguageSwitch() {
  const language = useLocale();
  return <div className='language-switch' role='group' aria-label={language === 'uk' ? 'Мова інтерфейсу' : 'Interface language'}>
    <button type='button' lang='uk' aria-label='Українська' aria-pressed={language === 'uk'} onClick={() => setLanguage('uk')}>UA</button>
    <button type='button' lang='en' aria-label='English' aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
  </div>;
}
