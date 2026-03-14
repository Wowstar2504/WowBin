import { Redis } from 'ioredis';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function POST(req: Request) {
  try {
    const { encryptedContent, iv, ttl } = await req.json();
    const id = nanoid(10);

    await redis.set(`note:${id}`, JSON.stringify({ encryptedContent, iv }), 'EX', ttl);

    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save to Redis" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  const data = await redis.get(`note:${id}`);
  if (!data) return NextResponse.json({ error: "Expired or not found" }, { status: 404 });
  
  await redis.del(`note:${id}`); 

  return NextResponse.json(JSON.parse(data));
}