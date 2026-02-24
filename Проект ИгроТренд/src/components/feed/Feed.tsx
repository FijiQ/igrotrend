'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Eye, MoreHorizontal, 
  Send, Image as ImageIcon, Globe, TrendingUp, Clock, Sparkles
} from 'lucide-react';
import { useStore, getLevelTitle } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Language } from '@/lib/i18n/config';

interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    level: number;
  };
  title: string;
  content: string;
  image?: string;
  language: Language;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  createdAt: string;
  isLiked: boolean;
}

const mockPosts: Post[] = [];

export function Feed() {
  const { t, user, isAuthenticated } = useStore();
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  const handleLike = (postId: string) => {
    if (!isAuthenticated) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.trim() || !newPostTitle.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: user!.id,
        username: user!.username,
        displayName: user!.displayName,
        avatar: user!.avatar,
        level: user!.level,
      },
      title: newPostTitle,
      content: newPost,
      language: 'ru',
      likes: 0,
      comments: 0,
      reposts: 0,
      views: 0,
      createdAt: 'только что',
      isLiked: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setNewPostTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-surface/80 backdrop-blur-xl border-border neon-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    {user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="Заголовок поста..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="bg-background-secondary border-border-subtle text-lg font-medium"
                  />
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  <Globe className="h-3 w-3 mr-1" />
                  RU
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <Textarea
                placeholder={t.posts.postPlaceholder}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-24 bg-background-secondary border-border-subtle resize-none"
              />
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/50 justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-foreground-muted">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {t.posts.addImage}
                </Button>
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim() || !newPostTitle.trim()}
                className="bg-gradient-to-r from-primary to-accent btn-glow"
              >
                <Send className="h-4 w-4 mr-2" />
                {t.posts.publish}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* Trending - will be populated by real user tags */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
        <Badge className="bg-primary/10 text-primary border-primary/30 whitespace-nowrap">
          <TrendingUp className="h-3 w-3 mr-1" />
          Тренды
        </Badge>
        {['gaming', 'ai', 'esports'].map((tag) => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded-full bg-surface-subtle border border-border-subtle text-sm text-foreground-secondary hover:text-foreground hover:border-primary/30 transition-all whitespace-nowrap"
          >
            #{tag}
          </motion.button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Card className="bg-surface/80 backdrop-blur-xl border-border card-neon overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/30">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {post.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.author.displayName || post.author.username}</span>
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            Lvl {post.author.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground-muted">
                          <span>@{post.author.username}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-foreground-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-surface border-border">
                        <DropdownMenuItem>Сохранить</DropdownMenuItem>
                        <DropdownMenuItem>Скопировать ссылку</DropdownMenuItem>
                        <DropdownMenuItem className="text-danger">Пожаловаться</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-foreground-secondary leading-relaxed">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          post.isLiked ? 'text-danger' : 'text-foreground-muted hover:text-danger'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-danger' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </motion.button>
                      <button className="flex items-center gap-1.5 text-foreground-muted hover:text-primary transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-foreground-muted hover:text-secondary transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm">{post.reposts}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground-muted">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{post.views}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.posts.noComments}</h3>
            <p className="text-foreground-secondary mb-6">{t.posts.beFirst}</p>
            {!isAuthenticated && (
              <Button
                onClick={() => useStore.getState().setActiveTab('register')}
                className="bg-gradient-to-r from-primary to-accent btn-glow"
              >
                {t.nav.register}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
