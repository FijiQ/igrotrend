'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Bell, Search, Globe, User, LogOut, Settings,
  Home, Newspaper, Users, Trophy, Heart, Gamepad2, Sparkles, Shield
} from 'lucide-react';
import { useStore, getLevelTitle, canAccessDevPanel } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Language, languageNames } from '@/lib/i18n/config';

const navItems = [
  { id: 'feed', icon: Newspaper, labelKey: 'feed' as const },
  { id: 'clubs', icon: Users, labelKey: 'clubs' as const },
  { id: 'teams', icon: Trophy, labelKey: 'teams' as const },
  { id: 'dating', icon: Heart, labelKey: 'dating' as const },
];

export function Header() {
  const { t, language, setLanguage, user, isAuthenticated, logout, activeTab, setActiveTab, setSidebarOpen } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-lg group-hover:bg-primary/50 transition-all" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              {t.appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'text-primary' 
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-4 w-4" />
                {t.nav[item.labelKey]}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 250, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    className="relative"
                  >
                    <Input
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-surface border-border-subtle focus:border-primary pr-8"
                      autoFocus
                      onBlur={() => setSearchOpen(false)}
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  </motion.div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    className="text-foreground-secondary hover:text-foreground"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground-secondary hover:text-foreground">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface border-border">
                {Object.entries(languageNames).map(([code, name]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as Language)}
                    className={language === code ? 'bg-primary/10 text-primary' : ''}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-foreground-secondary hover:text-foreground">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-surface border-border">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      {t.notifications.title}
                      <Button variant="ghost" size="sm" className="text-xs text-primary">
                        {t.notifications.markAllRead}
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <div className="max-h-64 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <DropdownMenuItem key={i} className="flex items-start gap-3 p-3 cursor-pointer">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary">U</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                              <span className="font-medium">User{i}</span> {t.notifications.newLike}
                            </p>
                            <p className="text-xs text-foreground-muted">2ч назад</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-primary/30 hover:border-primary transition-colors">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-surface rounded-full border border-border flex items-center justify-center">
                        <span className="text-[8px] font-bold text-primary">{user.level}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-surface border-border">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.displayName || user.username}</p>
                        <p className="text-xs text-foreground-muted">@{user.username}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {getLevelTitle(user.level, t)}
                          </Badge>
                          <Badge variant="outline" className="border-warning/30 text-warning text-xs">
                            {user.coins} монет
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => setActiveTab('profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t.nav.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {t.nav.settings}
                    </DropdownMenuItem>
                    {canAccessDevPanel(user) && (
                      <DropdownMenuItem onClick={() => setActiveTab('devpanel')} className="cursor-pointer text-warning">
                        <Shield className="mr-2 h-4 w-4" />
                        Dev Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={logout} className="text-danger cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t.nav.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('login')}
                  className="text-foreground-secondary hover:text-foreground"
                >
                  {t.nav.login}
                </Button>
                <Button 
                  onClick={() => setActiveTab('register')}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-glow"
                >
                  {t.nav.register}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-surface"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === item.id 
                      ? 'bg-primary/10 text-primary border border-primary/30' 
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {t.nav[item.labelKey]}
                </button>
              ))}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover"
                  >
                    <User className="h-5 w-5" />
                    {t.nav.login}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('register');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white"
                  >
                    {t.nav.register}
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
