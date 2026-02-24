'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { 
  Heart, X, Star, ChevronUp, Sparkles, Gamepad2, 
  Brain, MapPin, Clock, Trophy, MessageCircle
} from 'lucide-react';
import { useStore, getLevelTitle } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DatingProfile {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  level: number;
  bio?: string;
  city?: string;
  country?: string;
  interests: string[];
  games: string[];
  skillLevel: string;
  lookingFor: 'players' | 'experts' | 'both';
  isExpert: boolean;
}

const mockProfiles: DatingProfile[] = [];

const swipeThreshold = 100;

export function Dating() {
  const { t, user, isAuthenticated } = useStore();
  const [profiles, setProfiles] = useState(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<DatingProfile | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateZ = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const currentProfile = profiles[currentIndex];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (offset.y < -swipeThreshold || velocity.y < -500) {
      // Super Like (up)
      handleSuperLike();
    } else if (offset.x > swipeThreshold || velocity.x > 500) {
      // Like (right)
      handleLike();
    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
      // Nope (left)
      handleNope();
    }
  };

  const handleLike = () => {
    setDirection('right');
    setTimeout(() => {
      // Simulate 30% match chance
      if (Math.random() < 0.3 && currentProfile) {
        setMatchedProfile(currentProfile);
        setShowMatch(true);
      }
      nextProfile();
    }, 300);
  };

  const handleNope = () => {
    setDirection('left');
    setTimeout(nextProfile, 300);
  };

  const handleSuperLike = () => {
    if (!user || user.coins < 10) return;
    setDirection('up');
    setTimeout(() => {
      // Super like always matches
      if (currentProfile) {
        setMatchedProfile(currentProfile);
        setShowMatch(true);
      }
      nextProfile();
    }, 300);
  };

  const nextProfile = () => {
    setCurrentIndex((prev) => prev + 1);
    setDirection(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6"
        >
          <Heart className="h-12 w-12 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{t.dating.title}</h2>
        <p className="text-foreground-secondary mb-6">Войдите, чтобы искать игроков и AI-экспертов</p>
        <Button
          onClick={() => useStore.getState().setActiveTab('login')}
          className="bg-gradient-to-r from-primary to-accent btn-glow"
        >
          {t.nav.login}
        </Button>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-16 w-16 text-primary mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{t.dating.noMoreProfiles}</h2>
        <p className="text-foreground-secondary">{t.dating.checkLater}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold gradient-text">{t.dating.title}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-warning/30 text-warning">
            {user?.coins} монет
          </Badge>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[500px]">
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              ref={cardRef}
              key={currentProfile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                x: direction === 'right' ? 500 : direction === 'left' ? -500 : 0,
                y: direction === 'up' ? -500 : 0,
                opacity: 0,
                rotateZ: direction === 'right' ? 30 : direction === 'left' ? -30 : 0,
              }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              style={{ x, y, rotateZ, opacity }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Card className="h-full bg-surface/90 backdrop-blur-xl border-border overflow-hidden">
                {/* Profile Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                  <Avatar className="absolute inset-4 w-40 h-40 mx-auto border-4 border-background/50">
                    <AvatarImage src={currentProfile.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-4xl">
                      {currentProfile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Swipe indicators */}
                  <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-success/20 border-2 border-success text-success font-bold rotate-12"
                  >
                    LIKE
                  </motion.div>
                  <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-danger/20 border-2 border-danger text-danger font-bold -rotate-12"
                  >
                    NOPE
                  </motion.div>
                  <motion.div
                    style={{ opacity: superLikeOpacity }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-secondary/20 border-2 border-secondary text-secondary font-bold"
                  >
                    SUPER LIKE
                  </motion.div>
                </div>

                <CardContent className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{currentProfile.displayName || currentProfile.username}</h2>
                        {currentProfile.isExpert && (
                          <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Expert
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground-muted">@{currentProfile.username}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      <Trophy className="h-3 w-3 mr-1" />
                      Lvl {currentProfile.level}
                    </Badge>
                  </div>

                  {/* Location */}
                  {currentProfile.city && (
                    <div className="flex items-center gap-1 text-sm text-foreground-muted">
                      <MapPin className="h-4 w-4" />
                      {currentProfile.city}, {currentProfile.country}
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-sm text-foreground-secondary">{currentProfile.bio}</p>

                  {/* Games */}
                  <div className="space-y-2">
                    <span className="text-xs text-foreground-muted">Игры:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentProfile.games.map((game) => (
                        <Badge key={game} variant="secondary" className="text-xs">
                          <Gamepad2 className="h-3 w-3 mr-1" />
                          {game}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <span className="text-xs text-foreground-muted">Интересы:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentProfile.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNope}
          className="w-14 h-14 rounded-full bg-surface border-2 border-danger flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSuperLike}
          disabled={!user || user.coins < 10}
          className="w-12 h-12 rounded-full bg-surface border-2 border-secondary flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors disabled:opacity-50"
        >
          <Star className="h-5 w-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="w-14 h-14 rounded-full bg-surface border-2 border-success flex items-center justify-center text-success hover:bg-success hover:text-white transition-colors"
        >
          <Heart className="h-6 w-6" />
        </motion.button>
      </div>

      <p className="text-center text-xs text-foreground-muted mt-2">
        <Star className="h-3 w-3 inline mr-1" />
        {t.dating.superLikeCost}
      </p>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-surface border border-border rounded-2xl p-8 text-center max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4"
              >
                <Heart className="h-10 w-10 text-white fill-white" />
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text mb-2">{t.dating.match}</h2>
              <p className="text-foreground-secondary mb-4">
                Вы и {matchedProfile.displayName || matchedProfile.username} понравились друг другу!
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setShowMatch(false)}
                  variant="outline"
                >
                  Продолжить
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent btn-glow">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t.dating.message}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
