import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Disable 2FA
    // Note for Research: We are keeping the totp_secret (artifact) for forensic analysis
    // In a real app, you might want to nullify it: totp_secret: null
    await prisma.user.update({
      where: { id: userId },
      data: { 
        totp_enabled: false 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 });
  }
}
