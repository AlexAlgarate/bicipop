import { NextResponse } from 'next/server';

import { prisma } from '@/infrastructure/db/prisma/client';

export async function GET(request: Request) {
  if (request.headers.get('x-keep-alive-secret') !== process.env.KEEP_ALIVE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.user.findFirst({
    select: {
      id: true,
    },
  });

  return NextResponse.json({ ok: true });
}
