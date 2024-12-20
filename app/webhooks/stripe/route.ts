import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Webhook handled successfully", { status: 200 });
}
