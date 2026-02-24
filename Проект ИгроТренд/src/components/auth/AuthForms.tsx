'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, Gamepad2, Shield } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface AuthFormProps {
  onBack?: () => void;
}

export function LoginForm({ onBack }: AuthFormProps) {
  const { t, setUser, setToken, setActiveTab } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.auth.invalidCredentials);
        return;
      }

      setUser(data.user);
      setToken(data.token);
      setActiveTab('feed');
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  // Quick dev login
  const handleDevLogin = async () => {
    setEmail('dev@igrotrend.local');
    setPassword('dev123456');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'dev@igrotrend.local', password: 'dev123456' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка входа');
        return;
      }

      setUser(data.user);
      setToken(data.token);
      setActiveTab('devpanel');
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-surface/80 backdrop-blur-xl border-border neon-border">
        <CardHeader className="text-center space-y-4">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 top-4 text-foreground-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <motion.div
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Gamepad2 className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              {t.auth.loginTitle}
            </CardTitle>
            <CardDescription className="text-foreground-secondary mt-2">
              Добро пожаловать в {t.appName}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background-secondary border-border-subtle"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background-secondary border-border-subtle"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-glow"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              ) : (
                t.auth.loginButton
              )}
            </Button>
          </form>

          {/* Dev Login Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-foreground-muted">или</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleDevLogin}
            disabled={loading}
            className="w-full border-warning/30 text-warning hover:bg-warning/10"
          >
            <Shield className="h-4 w-4 mr-2" />
            Войти как разработчик
          </Button>

          <div className="text-center">
            <button
              onClick={() => setActiveTab('register')}
              className="text-sm text-primary hover:underline"
            >
              {t.auth.noAccount} {t.auth.registerButton}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function RegisterForm({ onBack }: AuthFormProps) {
  const { t, setUser, setToken, setActiveTab } = useStore();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.auth.passwordMinLength);
      return;
    }

    if (username.length < 3) {
      setError(t.auth.usernameMinLength);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.error);
        return;
      }

      setStep('verify');
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verifyCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.error);
        return;
      }

      setUser(data.user);
      setToken(data.token);
      setActiveTab('feed');
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-surface/80 backdrop-blur-xl border-border neon-border">
        <CardHeader className="text-center space-y-4">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 top-4 text-foreground-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <motion.div
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              {step === 'verify' ? t.auth.verifyEmail : t.auth.registerTitle}
            </CardTitle>
            <CardDescription className="text-foreground-secondary mt-2">
              {step === 'verify' ? t.auth.verifyEmailSent : 'Присоединяйтесь к сообществу'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t.auth.username}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className="pl-10 bg-background-secondary border-border-subtle"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">{t.auth.displayName}</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Имя"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background-secondary border-border-subtle"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t.auth.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background-secondary border-border-subtle"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t.auth.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background-secondary border-border-subtle"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t.auth.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-background-secondary border-border-subtle"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-danger text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 btn-glow"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    t.auth.registerButton
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label className="text-center block">{t.auth.verifyCode}</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verifyCode}
                      onChange={(value) => setVerifyCode(value)}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="bg-background-secondary border-border-subtle text-foreground text-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-danger text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  onClick={handleVerify}
                  disabled={loading || verifyCode.length !== 6}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-glow"
                >
                  {loading ? t.loading : t.auth.verifyEmail}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setStep('form')}
                    className="text-sm text-primary hover:underline"
                  >
                    {t.auth.resendCode}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 'form' && (
            <div className="text-center">
              <button
                onClick={() => setActiveTab('login')}
                className="text-sm text-primary hover:underline"
              >
                {t.auth.hasAccount} {t.auth.loginButton}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
