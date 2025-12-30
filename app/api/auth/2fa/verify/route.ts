import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, token } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.totp_secret) {
      return NextResponse.json({ error: '2FA not initialized' }, { status: 400 });
    }

    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: user.totp_secret,
    });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 });
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { totp_enabled: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
