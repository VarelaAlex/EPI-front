import logo from './logo.png';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function App() {

  const locales = {
    es: { title: 'Español' },
    en: { title: 'English' }
  };

  const { t, i18n } = useTranslation();

  const [isReadyForInstall, setIsReadyForInstall] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      setIsReadyForInstall(true);
    });
  }, []);

  async function downloadApp() {
    const promptEvent = window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice;
      window.deferredPrompt = null;
      setIsReadyForInstall(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" />
        <ul>
          {Object.keys(locales).map((locale) => (
            <li key={locale}><button style={{ fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(locale)}>
              {locales[locale].title}
            </button></li>
          ))}
        </ul>
        <h1>{t('welcome-message')}</h1>
        {isReadyForInstall && <button onClick={downloadApp}>Descarga</button>}
      </header>
    </div>
  );
}

export default App;
