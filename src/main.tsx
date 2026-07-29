import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function bootstrap() {
  // Initialize i18n first (preload the user's preferred language) so that the first screen renders with the correct language.
  const { initializeI18n } = await import('./i18n');
  await initializeI18n();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
