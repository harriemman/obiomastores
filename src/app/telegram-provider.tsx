'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loginWithTelegram } from '@/lib/api';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramContextType {
  initData: string | null;
  user: TelegramUser | null;
  themeParams: Record<string, string> | null;
  isInitialized: boolean;
  webApp: typeof window.Telegram.WebApp | null;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: { user?: TelegramUser };
        themeParams: Record<string, string>;
        expand: () => void;
        ready: () => void;
        onEvent: (event: string, handler: () => void) => void;
        offEvent: (event: string, handler: () => void) => void;
      };
    };
  }
}

const TelegramContext = createContext<TelegramContextType>({
  initData: null,
  user: null,
  themeParams: null,
  isInitialized: false,
  webApp: null,
});

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [ctx, setCtx] = useState<TelegramContextType>({
    initData: null,
    user: null,
    themeParams: null,
    isInitialized: false,
    webApp: null,
  });

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user ?? null;

    setCtx({
      initData: tg.initData || null,
      user,
      themeParams: tg.themeParams ?? null,
      isInitialized: true,
      webApp: tg,
    });

    // Auto-login with backend
    if (tg.initData) {
      loginWithTelegram(tg.initData).catch(() => {
        // Silent fail in dev without real Telegram context
      });
    }

    const themeHandler = () => {
      setCtx(prev => ({ ...prev, themeParams: tg.themeParams }));
    };

    tg.onEvent('theme_changed', themeHandler);
    return () => tg.offEvent('theme_changed', themeHandler);
  }, []);

  return (
    <TelegramContext.Provider value={ctx}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
