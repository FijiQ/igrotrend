'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Plus, Search, Clock, CheckCircle, XCircle, Shield, Gamepad2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  id: string;
  username: string;
  nickname: string;
  role: 'captain' | 'player' | 'coach' | 'manager';
  position?: string;
}

interface Team {
  id: string;
  name: string;
  tag: string;
  description?: string;
  logo?: string;
  game: string;
  status: 'pending' | 'approved' | 'rejected';
  members: TeamMember[];
}

const mockTeams: Team[] = [];

const games = ['CS2', 'Dota 2', 'League of Legends', 'Valorant', 'GTA 6', 'Fortnite', 'Apex Legends', 'Overwatch 2', 'PUBG', 'Minecraft', 'Roblox', 'AI Sandbox', 'Other'];

export function Teams() {
  const { t, isAuthenticated } = useStore();
  const [teams, setTeams] = useState(mockTeams);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [application, setApplication] = useState({
    teamName: '',
    tag: '',
    game: '',
    description: '',
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || team.game === selectedGame;
    return matchesSearch && matchesGame;
  });

  const getStatusBadge = (status: Team['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/20 text-success border-success/30"><CheckCircle className="h-3 w-3 mr-1" />{t.teams.approved}</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/30"><Clock className="h-3 w-3 mr-1" />{t.teams.pending}</Badge>;
      case 'rejected':
        return <Badge className="bg-danger/20 text-danger border-danger/30"><XCircle className="h-3 w-3 mr-1" />{t.teams.rejected}</Badge>;
    }
  };

  const handleApplyForTeam = () => {
    // In real app, this would send to support
    setApplyDialogOpen(false);
    setApplication({ teamName: '', tag: '', game: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">{t.teams.title}</h1>
          <p className="text-foreground-secondary">Регистрация и управление командами</p>
        </div>
        
        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              {t.teams.applyForTeam}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface border-border max-w-md">
            <DialogHeader>
              <DialogTitle>{t.teams.applyForTeam}</DialogTitle>
              <DialogDescription>{t.teams.teamRulesText}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.teams.teamName}</Label>
                  <Input
                    value={application.teamName}
                    onChange={(e) => setApplication({ ...application, teamName: e.target.value })}
                    className="bg-background-secondary border-border-subtle"
                    placeholder="Cyber Legends"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.teams.teamTag}</Label>
                  <Input
                    value={application.tag}
                    onChange={(e) => setApplication({ ...application, tag: e.target.value.toUpperCase() })}
                    className="bg-background-secondary border-border-subtle"
                    placeholder="CL"
                    maxLength={5}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.teams.game}</Label>
                <Select value={application.game} onValueChange={(v) => setApplication({ ...application, game: v })}>
                  <SelectTrigger className="bg-background-secondary border-border-subtle">
                    <SelectValue placeholder="Выберите игру" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    {games.map((game) => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.teams.description}</Label>
                <Textarea
                  value={application.description}
                  onChange={(e) => setApplication({ ...application, description: e.target.value })}
                  className="bg-background-secondary border-border-subtle"
                  placeholder="Расскажите о команде..."
                />
              </div>
              <Button
                onClick={handleApplyForTeam}
                className="w-full bg-gradient-to-r from-primary to-accent btn-glow"
              >
                {t.teams.contactSupport}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface border-border-subtle"
          />
        </div>
        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger className="w-full sm:w-48 bg-surface border-border-subtle">
            <SelectValue placeholder={t.dating.game} />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border">
            <SelectItem value="all">{t.all}</SelectItem>
            {games.map((game) => (
              <SelectItem key={game} value={game}>{game}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="h-full bg-surface/80 backdrop-blur-xl border-border card-neon">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full rounded-xl" />
                        ) : (
                          <div className="text-center">
                            <span className="text-xs font-bold text-primary block">{team.tag}</span>
                            <Trophy className="h-5 w-5 text-primary mx-auto" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {team.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Gamepad2 className="h-3 w-3" />
                          {team.game}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(team.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {team.description && (
                    <p className="text-sm text-foreground-secondary mb-4">{team.description}</p>
                  )}
                  
                  {/* Team Members */}
                  <div className="space-y-2">
                    <span className="text-xs text-foreground-muted">{t.teams.members}:</span>
                    <div className="flex flex-wrap gap-2">
                      {team.members.slice(0, 5).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background-secondary"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {member.nickname.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-xs font-medium">{member.nickname}</span>
                            {member.position && (
                              <span className="text-[10px] text-foreground-muted ml-1">({member.position})</span>
                            )}
                          </div>
                          {member.role === 'captain' && (
                            <Shield className="h-3 w-3 text-warning" />
                          )}
                        </div>
                      ))}
                      {team.members.length > 5 && (
                        <span className="text-xs text-foreground-muted self-center">
                          +{team.members.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4 flex items-center justify-between">
                  <span className="text-sm text-foreground-muted flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {team.members.length} {t.teams.members}
                  </span>
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    Подробнее
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
          <p className="text-foreground-secondary">Команды не найдены</p>
        </div>
      )}
    </div>
  );
}
