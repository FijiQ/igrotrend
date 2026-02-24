'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Trophy, Heart, Settings, Database,
  Shield, Activity, Trash2, CheckCircle, XCircle,
  Clock, Search, RefreshCw, Download, AlertTriangle,
  BarChart3, Ban, Mail, Loader2
} from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

interface Stats {
  users: { total: number; active: number; newToday: number };
  posts: { total: number; pending: number; reported: number };
  teams: { total: number; pending: number; approved: number };
  clubs: { total: number; public: number; private: number };
  dating: { total: number; matches: number };
  comments: number;
  likes: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  level: number;
  coins: number;
  role: string;
  emailStatus: string;
  language: string;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
    subscribers: number;
  };
}

interface Team {
  id: string;
  name: string;
  tag: string;
  game: string;
  status: string;
  logo: string | null;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
    email: string;
  };
  _count: { members: number };
}

interface Club {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  image: string | null;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
  };
  _count: { members: number };
}

interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
  };
  _count: { comments: number; likes: number };
}

const adminSections = [
  { id: 'overview', label: 'Обзор', icon: BarChart3 },
  { id: 'users', label: 'Пользователи', icon: Users },
  { id: 'content', label: 'Контент', icon: FileText },
  { id: 'teams', label: 'Команды', icon: Trophy },
  { id: 'clubs', label: 'Клубы', icon: Shield },
  { id: 'database', label: 'База данных', icon: Database },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export function DevPanel() {
  const [activeSection, setActiveSection] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    await fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground-secondary">Загрузка Dev Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-bold">Dev Panel</h1>
            <Badge variant="outline" className="border-warning/30 text-warning text-xs">
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => useStore.getState().setActiveTab('feed')}
            >
              На сайт →
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden md:block">
            <nav className="space-y-1 sticky top-20">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                  {section.id === 'teams' && stats?.teams.pending && stats.teams.pending > 0 && (
                    <Badge className="ml-auto bg-warning/20 text-warning text-xs">
                      {stats.teams.pending}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 p-2 overflow-x-auto">
            <div className="flex gap-2">
              {adminSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className="shrink-0"
                >
                  <section.icon className="h-4 w-4 mr-1" />
                  {section.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-20 md:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeSection === 'overview' && <OverviewSection stats={stats} onRefresh={fetchStats} />}
                {activeSection === 'users' && <UsersSection />}
                {activeSection === 'content' && <ContentSection />}
                {activeSection === 'teams' && <TeamsSection />}
                {activeSection === 'clubs' && <ClubsSection />}
                {activeSection === 'database' && <DatabaseSection stats={stats} />}
                {activeSection === 'settings' && <SettingsSection />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// Overview Section
function OverviewSection({ stats, onRefresh }: { stats: Stats | null; onRefresh: () => void }) {
  const statCards = [
    { label: 'Пользователей', value: stats?.users.total || 0, icon: Users, color: 'text-primary', change: `+${stats?.users.newToday || 0} сегодня` },
    { label: 'Постов', value: stats?.posts.total || 0, icon: FileText, color: 'text-secondary', change: `${stats?.posts.pending || 0} на модерации` },
    { label: 'Команд', value: stats?.teams.total || 0, icon: Trophy, color: 'text-accent', change: `${stats?.teams.pending || 0} заявок` },
    { label: 'Клубов', value: stats?.clubs.total || 0, icon: Shield, color: 'text-success', change: `${stats?.clubs.public || 0} публичных` },
    { label: 'Матчей', value: stats?.dating.matches || 0, icon: Heart, color: 'text-danger', change: `${stats?.dating.total || 0} свайпов` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Обзор платформы</h2>
        <p className="text-foreground-secondary">Статистика и быстрые действия</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-surface/80 backdrop-blur-xl border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-surface-subtle flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-foreground-muted">{stat.label}</p>
                <p className="text-xs text-foreground-secondary mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardHeader>
          <CardTitle className="text-lg">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Найти пользователя
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Модерация
            </Button>
            <Button variant="outline" className="justify-start">
              <Trophy className="h-4 w-4 mr-2" />
              Заявки команд
            </Button>
            <Button variant="outline" className="justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Рассылка
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Developer Account Info */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Информация для разработчика
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
            <div>
              <p className="text-sm font-medium">Developer Account</p>
              <p className="text-xs text-foreground-muted">dev@igrotrend.local</p>
            </div>
            <Badge className="bg-primary/20 text-primary">DEVELOPER</Badge>
          </div>
          <p className="text-xs text-foreground-muted">
            💡 Вы вошли как разработчик. Dev Panel доступен только для роли DEVELOPER.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Users Section
function UsersSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (roleFilter) params.set('role', roleFilter);
      
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Пользователи</h2>
          <p className="text-foreground-secondary">Управление аккаунтами</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent btn-glow">
          <Users className="h-4 w-4 mr-2" />
          Создать пользователя
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Поиск по email, username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface border-border-subtle"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-surface border-border-subtle">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border">
            <SelectItem value="">Все роли</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="DEVELOPER">DEVELOPER</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
              <p className="text-foreground-secondary">Пользователей пока нет</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.displayName || user.username}</p>
                      <Badge variant="outline" className={`text-xs ${
                        user.role === 'DEVELOPER' ? 'border-primary/30 text-primary' :
                        user.role === 'ADMIN' ? 'border-warning/30 text-warning' :
                        'border-border text-foreground-muted'
                      }`}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground-muted truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground-muted">
                    <span>Ур. {user.level}</span>
                    <span>{user.coins} монет</span>
                    <div className="flex gap-2">
                      <span>{user._count.posts} постов</span>
                      <span>{user._count.subscribers} подписчиков</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Content Section
function ContentSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Контент</h2>
          <p className="text-foreground-secondary">Модерация постов и комментариев</p>
        </div>
      </div>

      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
              <p className="text-foreground-secondary">Контента пока нет</p>
              <p className="text-sm text-foreground-muted">Пользователи смогут создавать посты после регистрации</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-surface-hover transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author.avatar || undefined} />
                      <AvatarFallback>{post.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <p className="text-sm text-foreground-muted line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-foreground-muted">
                        <span>@{post.author.username}</span>
                        <span>{post._count.likes} лайков</span>
                        <span>{post._count.comments} комментариев</span>
                        <span>{post.viewCount} просмотров</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-danger" onClick={() => deletePost(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Teams Section
function TeamsSection() {
  const [filter, setFilter] = useState('pending');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, [filter]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter.toUpperCase());
      
      const res = await fetch(`/api/admin/teams?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTeamStatus = async (teamId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, status }),
      });
      if (res.ok) {
        setTeams(teams.filter(t => t.id !== teamId));
      }
    } catch (error) {
      console.error('Failed to update team:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Команды</h2>
          <p className="text-foreground-secondary">Управление киберспортивными командами</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-warning text-black' : ''}
          >
            <Clock className="h-4 w-4 mr-2" />
            Заявки
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Одобренные
          </Button>
        </div>
      </div>

      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
              <p className="text-foreground-secondary">
                {filter === 'pending' ? 'Заявок на создание команд пока нет' : 'Команд нет'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {teams.map((team) => (
                <div key={team.id} className="p-4 hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-subtle flex items-center justify-center text-lg font-bold">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        team.tag
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{team.name}</h3>
                        <Badge variant="outline" className="text-xs">{team.game}</Badge>
                      </div>
                      <p className="text-sm text-foreground-muted">
                        Создатель: @{team.creator.username} ({team.creator.email})
                      </p>
                      <p className="text-xs text-foreground-muted">
                        Участников: {team._count.members}
                      </p>
                    </div>
                    {filter === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => updateTeamStatus(team.id, 'APPROVED')}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Одобрить
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateTeamStatus(team.id, 'REJECTED')}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Clubs Section
function ClubsSection() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clubs');
      if (res.ok) {
        const data = await res.json();
        setClubs(data.clubs);
      }
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Клубы</h2>
          <p className="text-foreground-secondary">Управление сообществами</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent btn-glow">
          Создать клуб
        </Button>
      </div>

      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
              <p className="text-foreground-secondary">Клубов пока нет</p>
              <p className="text-sm text-foreground-muted">Пользователи смогут создавать клубы</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {clubs.map((club) => (
                <div key={club.id} className="p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-surface-subtle flex items-center justify-center">
                    {club.image ? (
                      <img src={club.image} alt={club.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <Shield className="h-6 w-6 text-foreground-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{club.name}</h3>
                      {club.isPrivate && (
                        <Badge variant="outline" className="text-xs">Приватный</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground-muted line-clamp-1">{club.description}</p>
                    <p className="text-xs text-foreground-muted">
                      Создатель: @{club.creator.username} • {club._count.members} участников
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Database Section
function DatabaseSection({ stats }: { stats: Stats | null }) {
  const [confirmReset, setConfirmReset] = useState(false);

  const tables = [
    { name: 'User', count: stats?.users.total || 0 },
    { name: 'Post', count: stats?.posts.total || 0 },
    { name: 'Comment', count: stats?.comments || 0 },
    { name: 'Like', count: stats?.likes || 0 },
    { name: 'Club', count: stats?.clubs.total || 0 },
    { name: 'Team', count: stats?.teams.total || 0 },
    { name: 'DatingSwipe', count: stats?.dating.total || 0 },
    { name: 'DatingMatch', count: stats?.dating.matches || 0 },
    { name: 'Notification', count: 0 },
    { name: 'VerificationCode', count: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">База данных</h2>
        <p className="text-foreground-secondary">Управление данными платформы</p>
      </div>

      {/* Tables Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tables.map((table) => (
          <Card key={table.name} className="bg-surface/80 backdrop-blur-xl border-border">
            <CardContent className="p-3">
              <p className="text-xs text-foreground-muted">{table.name}</p>
              <p className="text-xl font-bold">{table.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-surface/80 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle className="text-lg">Экспорт данных</CardTitle>
            <CardDescription>Скачать дамп базы данных</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Экспорт SQLite
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-surface/80 backdrop-blur-xl border-border border-danger/20">
          <CardHeader>
            <CardTitle className="text-lg text-danger flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Опасная зона
            </CardTitle>
            <CardDescription>Необратимые действия</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистить базу данных
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-surface border-border">
                <DialogHeader>
                  <DialogTitle>Подтвердите действие</DialogTitle>
                  <DialogDescription>
                    Это действие удалит ВСЕ данные без возможности восстановления. Вы уверены?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmReset(false)}>
                    Отмена
                  </Button>
                  <Button variant="destructive">
                    Да, удалить всё
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Raw SQL Query */}
      <Card className="bg-surface/80 backdrop-blur-xl border-border">
        <CardHeader>
          <CardTitle className="text-lg">SQL Query</CardTitle>
          <CardDescription>Выполнить произвольный SQL запрос</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT * FROM User..."
            className="font-mono bg-background-secondary border-border-subtle min-h-24"
          />
          <Button variant="outline">
            Выполнить запрос
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки</h2>
        <p className="text-foreground-secondary">Конфигурация платформы</p>
      </div>

      <div className="grid gap-4">
        {/* General Settings */}
        <Card className="bg-surface/80 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle className="text-lg">Общие настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Название платформы</label>
                <Input defaultValue="ИгроТренд" className="bg-background-secondary border-border-subtle" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Язык по умолчанию</label>
                <Select defaultValue="ru">
                  <SelectTrigger className="bg-background-secondary border-border-subtle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="kz">Қазақша</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="by">Беларуская</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level System */}
        <Card className="bg-surface/80 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle className="text-lg">Система уровней</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">XP за уровень</label>
                <Input type="number" defaultValue="100" className="bg-background-secondary border-border-subtle" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Монет за уровень</label>
                <Input type="number" defaultValue="50" className="bg-background-secondary border-border-subtle" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Стартовые монеты</label>
                <Input type="number" defaultValue="100" className="bg-background-secondary border-border-subtle" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Супер-лайк (монет)</label>
                <Input type="number" defaultValue="10" className="bg-background-secondary border-border-subtle" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-surface/80 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle className="text-lg">Email настройки</CardTitle>
            <CardDescription>Конфигурация почтовых уведомлений</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">SMTP сервер</label>
                <Input placeholder="smtp.example.com" className="bg-background-secondary border-border-subtle" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Порт</label>
                <Input type="number" placeholder="587" className="bg-background-secondary border-border-subtle" />
              </div>
            </div>
            <p className="text-xs text-foreground-muted">
              💡 В демо-режиме коды подтверждения выводятся в консоль сервера
            </p>
          </CardContent>
        </Card>

        <Button className="bg-gradient-to-r from-primary to-accent btn-glow">
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
}
