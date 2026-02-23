import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "API moved to backend service." },
    { status: 410 }
  );
}
