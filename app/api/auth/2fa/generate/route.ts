import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate Secret
    const secret = authenticator.generateSecret();
    
    // Save secret temporarily or permanently?
    // For this flow, we save it immediately but keep enabled=false until verified
    await prisma.user.update({
      where: { id: userId },
      data: { totp_secret: secret },
    });

    // Generate QR Code
    const otpauth = authenticator.keyuri(user.username, 'ForensicApp', secret);
    const imageUrl = await QRCode.toDataURL(otpauth);

    return NextResponse.json({
      secret,
      qrCode: imageUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
