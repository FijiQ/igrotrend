'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore, canAccessDevPanel } from '@/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm, RegisterForm } from '@/components/auth/AuthForms';
import { Feed } from '@/components/feed/Feed';
import { Clubs } from '@/components/clubs/Clubs';
import { Teams } from '@/components/teams/Teams';
import { Dating } from '@/components/dating/Dating';
import { Profile } from '@/components/profile/Profile';
import { DevPanel } from '@/components/admin/DevPanel';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FAQ } from '@/components/support/FAQ';
import { Rules } from '@/components/support/Rules';
import { Privacy } from '@/components/support/Privacy';

export default function Home() {
  const { activeTab, t } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'clubs':
        return <Clubs />;
      case 'teams':
        return <Teams />;
      case 'dating':
        return <Dating />;
      case 'profile':
        return <Profile />;
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'settings':
        return <Settings />;
      case 'faq':
        return <FAQ />;
      case 'rules':
        return <Rules />;
      case 'privacy':
        return <Privacy />;
      case 'devpanel':
        return canAccessDevPanel(useStore.getState().user) ? <DevPanel /> : <AccessDenied />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

function Settings() {
  const { t, language, setLanguage } = useStore();
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold gradient-text">{t.settings.title}</h1>
      
      <div className="grid gap-4">
        <div className="p-6 rounded-xl bg-surface/80 backdrop-blur-xl border-border card-neon space-y-4">
          <h2 className="font-semibold">{t.settings.language}</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { code: 'ru', name: 'Русский' },
              { code: 'kz', name: 'Қазақша' },
              { code: 'en', name: 'English' },
              { code: 'by', name: 'Беларуская' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'ru' | 'kz' | 'en' | 'by')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  language === lang.code
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-background-secondary text-foreground-secondary hover:text-foreground border border-transparent'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-surface/80 backdrop-blur-xl border-border card-neon space-y-4">
          <h2 className="font-semibold">{t.settings.account}</h2>
          <div className="space-y-4">
            <button className="w-full p-4 rounded-lg bg-background-secondary text-left hover:bg-surface-hover transition-colors">
              {t.settings.changePassword}
            </button>
            <button className="w-full p-4 rounded-lg bg-background-secondary text-left hover:bg-surface-hover transition-colors">
              {t.settings.privacy}
            </button>
            <button className="w-full p-4 rounded-lg bg-danger/10 text-danger text-left hover:bg-danger/20 transition-colors">
              {t.settings.deleteAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessDenied() {
  const { t } = useStore();
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-danger/20 flex items-center justify-center mb-6">
        <Lock className="h-12 w-12 text-danger" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Доступ запрещён</h1>
      <p className="text-foreground-secondary mb-6 max-w-md">
        Dev Panel доступен только для аккаунтов с ролью DEVELOPER. 
        Войдите под специальным аккаунтом разработчика.
      </p>
      <div className="bg-surface/80 rounded-xl p-6 border border-border max-w-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-warning" />
          Учётные данные разработчика
        </h3>
        <div className="text-left space-y-2 text-sm">
          <p><span className="text-foreground-muted">Email:</span> <code className="bg-background-secondary px-2 py-0.5 rounded">dev@igrotrend.local</code></p>
          <p><span className="text-foreground-muted">Пароль:</span> <code className="bg-background-secondary px-2 py-0.5 rounded">dev123456</code></p>
        </div>
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-primary to-accent btn-glow"
          onClick={() => useStore.getState().setActiveTab('login')}
        >
          Войти как разработчик
        </Button>
      </div>
    </div>
  );
}
