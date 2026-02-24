import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [teams, total] = await Promise.all([
      db.team.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              email: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: { members: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.team.count({ where }),
    ]);

    return NextResponse.json({
      teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Teams list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { teamId, status } = await request.json();

    if (!teamId || !status) {
      return NextResponse.json({ error: 'Team ID and status are required' }, { status: 400 });
    }

    const team = await db.team.update({
      where: { id: teamId },
      data: { status },
    });

    // Create notification for team creator
    await db.notification.create({
      data: {
        userId: team.creatorId,
        type: status === 'APPROVED' ? 'team_approved' : 'team_rejected',
        title: status === 'APPROVED' ? 'Команда одобрена!' : 'Команда отклонена',
        content: status === 'APPROVED' 
          ? `Ваша команда "${team.name}" была одобрена администратором.`
          : `Ваша команда "${team.name}" была отклонена администратором.`,
      },
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Team update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
