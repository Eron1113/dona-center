import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/data";
import { errorMessage } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Email i pavlefshëm" },
        { status: 400 }
      );
    }

    await subscribeNewsletter(email);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 500 }
    );
  }
}
