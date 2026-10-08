import { t, useLocale } from "../../i18n/locale";
import React from 'react';
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, {
  failed: boolean;
}> {
  state = {
    failed: false
  };
  static getDerivedStateFromError() {
    return {
      failed: true
    };
  }
  render() {
    return this.state.failed ? <main style={{
      padding: 40
    }}><h1>{t("Не вдалося відкрити сторінку")}</h1><p>{t("Оновіть сторінку та спробуйте ще раз.")}</p><button onClick={() => window.location.assign('/')}>{t("На головну")}</button></main> : this.props.children;
  }
}
