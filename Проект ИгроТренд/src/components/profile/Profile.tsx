'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, Settings, Trophy, Coins, Star, Calendar, MapPin,
  Gamepad2, Brain, Heart, Share2, Mail
} from 'lucide-react';
import { useStore, getLevelTitle, getExpToNextLevel } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Profile() {
  const { t, user, isAuthenticated } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    city: '',
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Trophy className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t.nav.profile}</h2>
        <p className="text-foreground-secondary mb-6">Войдите, чтобы видеть свой профиль</p>
        <Button
          onClick={() => useStore.getState().setActiveTab('login')}
          className="bg-gradient-to-r from-primary to-accent btn-glow"
        >
          {t.nav.login}
        </Button>
      </div>
    );
  }

  const expToNext = getExpToNextLevel(user.exp);
  const expPercent = ((user.exp % 100) / 100) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDE0di0yaDIyek0zNiAyNnYySDEwdi0yaDI2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>
        
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <Avatar className="h-24 w-24 border-4 border-surface">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{user.level}</span>
              </div>
            </motion.div>
            
            <div className="flex-1 sm:pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Star className="h-3 w-3 mr-1" />
                  {getLevelTitle(user.level, t)}
                </Badge>
              </div>
              <p className="text-foreground-muted">@{user.username}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="border-primary/30 text-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t.profile.editProfile}
              </Button>
              <Button variant="outline" className="border-border">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-surface/80 backdrop-blur-xl border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.level}</p>
                <p className="text-xs text-foreground-muted">{t.profile.level}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-surface/80 backdrop-blur-xl border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <Coins className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.coins}</p>
                <p className="text-xs text-foreground-muted">{t.profile.coins}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-surface/80 backdrop-blur-xl border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Heart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">256</p>
                <p className="text-xs text-foreground-muted">{t.profile.followers}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-surface/80 backdrop-blur-xl border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-foreground-muted">{t.profile.posts}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Experience Progress */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t.profile.exp}</span>
          <span className="text-sm text-foreground-muted">{expToNext} {t.levels.expToNext}</span>
        </div>
        <Progress value={expPercent} className="h-2 bg-background-secondary" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bio & Info */}
        <Card className="bg-surface/80 backdrop-blur-xl border-border">
          <CardContent className="p-6 space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>{t.auth.displayName}</Label>
                  <Input
                    value={editData.displayName}
                    onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                    className="bg-background-secondary border-border-subtle"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.profile.bio}</Label>
                  <Textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="bg-background-secondary border-border-subtle"
                    placeholder={t.profile.bio}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.profile.location}</Label>
                  <Input
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    className="bg-background-secondary border-border-subtle"
                    placeholder="Москва, Россия"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)} className="bg-gradient-to-r from-primary to-accent btn-glow">
                    {t.save}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t.cancel}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold mb-2">{t.profile.bio}</h3>
                  <p className="text-foreground-secondary">
                    {user.bio || 'Расскажите о себе...'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <MapPin className="h-4 w-4" />
                  <span>Москва, Россия</span>
                </div>
                
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <Calendar className="h-4 w-4" />
                  <span>{t.profile.joined} январь 2026</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="bg-surface/80 backdrop-blur-xl border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {t.profile.interests}
            </h3>
            <div className="flex flex-wrap gap-2">
              {['CS2', 'AI', 'Киберспорт', 'Нейросети', 'Dota 2', 'Machine Learning'].map((interest) => (
                <Badge key={interest} variant="outline" className="border-primary/30 text-primary">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Последняя активность</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background-secondary/50">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Опубликовал пост "Нейросети в играх"</p>
                  <p className="text-xs text-foreground-muted">2 часа назад</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
