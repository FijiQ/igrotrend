'use client';

import Link from 'next/link';
import { Gamepad2, Heart, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { Language, languageNames } from '@/lib/i18n/config';

export function Footer() {
  const { t, language, setLanguage } = useStore();

  return (
    <footer className="mt-auto border-t border-border/50 bg-surface/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">{t.appName}</span>
            </Link>
            <p className="text-sm text-foreground-secondary">
              {t.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t.nav.home}</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => useStore.getState().setActiveTab('feed')} className="text-sm text-foreground-secondary hover:text-primary transition-colors">
                  {t.nav.feed}
                </button>
              </li>
              <li>
                <button onClick={() => useStore.getState().setActiveTab('clubs')} className="text-sm text-foreground-secondary hover:text-primary transition-colors">
                  {t.nav.clubs}
                </button>
              </li>
              <li>
                <button onClick={() => useStore.getState().setActiveTab('teams')} className="text-sm text-foreground-secondary hover:text-primary transition-colors">
                  {t.nav.teams}
                </button>
              </li>
              <li>
                <button onClick={() => useStore.getState().setActiveTab('dating')} className="text-sm text-foreground-secondary hover:text-primary transition-colors">
                  {t.nav.dating}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => useStore.getState().setActiveTab('faq')}
                  className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => useStore.getState().setActiveTab('rules')}
                  className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                >
                  Правила сообщества
                </button>
              </li>
              <li>
                <button
                  onClick={() => useStore.getState().setActiveTab('privacy')}
                  className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                >
                  Политика конфиденциальности
                </button>
              </li>
              <li>
                <button
                  onClick={() => useStore.getState().setActiveTab('contacts')}
                  className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                >
                  Контакты
                </button>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t.settings.language}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(languageNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as Language)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    language === code
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-surface-subtle text-foreground-secondary hover:text-foreground hover:bg-surface-hover border border-transparent'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-muted">
            © 2026 {t.appName}. Все права защищены.
          </p>
          <p className="text-sm text-foreground-muted flex items-center gap-1">
            Сделано с <Heart className="h-4 w-4 text-danger fill-danger" /> для геймеров и AI-энтузиастов
          </p>
        </div>
      </div>
    </footer>
  );
}
