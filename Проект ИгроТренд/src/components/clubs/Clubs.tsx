'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Lock, Globe, Plus, Search, Crown, UserCheck } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Club {
  id: string;
  name: string;
  description: string;
  image?: string;
  isPrivate: boolean;
  memberCount: number;
  creator: {
    username: string;
    avatar?: string;
  };
}

const mockClubs: Club[] = [];

export function Clubs() {
  const { t, isAuthenticated } = useStore();
  const [clubs, setClubs] = useState(mockClubs);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', description: '', isPrivate: false });

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClub = () => {
    if (!newClub.name.trim() || !newClub.description.trim()) return;

    const club: Club = {
      id: Date.now().toString(),
      name: newClub.name,
      description: newClub.description,
      isPrivate: newClub.isPrivate,
      memberCount: 1,
      creator: { username: useStore.getState().user?.username || 'user' },
    };

    setClubs([club, ...clubs]);
    setNewClub({ name: '', description: '', isPrivate: false });
    setCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">{t.clubs.title}</h1>
          <p className="text-foreground-secondary">Найди единомышленников</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              {t.clubs.createClub}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface border-border">
            <DialogHeader>
              <DialogTitle>{t.clubs.createClub}</DialogTitle>
              <DialogDescription>Создайте сообщество по интересам</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t.clubs.clubName}</Label>
                <Input
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  className="bg-background-secondary border-border-subtle"
                  placeholder="Название клуба"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.clubs.clubDescription}</Label>
                <Textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  className="bg-background-secondary border-border-subtle"
                  placeholder="О чём этот клуб?"
                />
              </div>
              <Button
                onClick={handleCreateClub}
                className="w-full bg-gradient-to-r from-primary to-accent btn-glow"
              >
                {t.create}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
        <Input
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-surface border-border-subtle"
        />
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="h-full bg-surface/80 backdrop-blur-xl border-border card-neon flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {club.name}
                          {club.isPrivate && (
                            <Lock className="h-4 w-4 text-foreground-muted" />
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          @{club.creator.username}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={club.isPrivate ? 'border-warning/30 text-warning' : 'border-success/30 text-success'}>
                      {club.isPrivate ? t.clubs.private : t.clubs.public}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-foreground-secondary">{club.description}</p>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4 flex items-center justify-between">
                  <span className="text-sm text-foreground-muted flex items-center gap-1">
                    <UserCheck className="h-4 w-4" />
                    {club.memberCount} {t.clubs.members}
                  </span>
                  <Button
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {t.clubs.joinClub}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
          <p className="text-foreground-secondary">{t.clubs.noClubs}</p>
          <p className="text-sm text-foreground-muted">{t.clubs.createFirst}</p>
        </div>
      )}
    </div>
  );
}
