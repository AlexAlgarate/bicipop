import { NextResponse } from 'next/server';

import prisma from '@/infrastructure/db/prisma/client';

export async function GET(request: Request) {
  if (request.headers.get('x-keep-alive-secret') !== process.env.KEEP_ALIVE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.user.findFirst({
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Database error',
      },
      { status: 500 }
    );
  }
}
