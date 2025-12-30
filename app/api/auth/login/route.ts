import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) { // Simple comparison
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user info and 2FA status
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        totp_enabled: user.totp_enabled,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
