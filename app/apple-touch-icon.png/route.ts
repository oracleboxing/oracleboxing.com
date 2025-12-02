import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(
    'https://media.oracleboxing.com/favicons/apple-touch-icon.png',
    301
  );
}
