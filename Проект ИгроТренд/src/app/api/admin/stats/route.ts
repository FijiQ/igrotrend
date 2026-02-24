import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get counts from all tables
    const [
      usersCount,
      postsCount,
      commentsCount,
      likesCount,
      clubsCount,
      teamsCount,
      teamsPending,
      datingSwipesCount,
      datingMatchesCount,
      notificationsCount,
    ] = await Promise.all([
      db.user.count(),
      db.post.count(),
      db.comment.count(),
      db.like.count(),
      db.club.count(),
      db.team.count(),
      db.team.count({ where: { status: 'PENDING' } }),
      db.datingSwipe.count(),
      db.datingMatch.count(),
      db.notification.count(),
    ]);

    // Get users created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await db.user.count({
      where: { createdAt: { gte: today } },
    });

    // Get active users (logged in within last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = await db.user.count({
      where: { updatedAt: { gte: weekAgo } },
    });

    // Get public/private clubs
    const publicClubs = await db.club.count({ where: { isPrivate: false } });
    const privateClubs = await db.club.count({ where: { isPrivate: true } });

    // Get approved teams
    const approvedTeams = await db.team.count({ where: { status: 'APPROVED' } });

    return NextResponse.json({
      users: {
        total: usersCount,
        active: activeUsers,
        newToday: newUsersToday,
      },
      posts: {
        total: postsCount,
        pending: 0,
        reported: 0,
      },
      teams: {
        total: teamsCount,
        pending: teamsPending,
        approved: approvedTeams,
      },
      clubs: {
        total: clubsCount,
        public: publicClubs,
        private: privateClubs,
      },
      dating: {
        total: datingSwipesCount,
        matches: datingMatchesCount,
      },
      comments: commentsCount,
      likes: likesCount,
      notifications: notificationsCount,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
