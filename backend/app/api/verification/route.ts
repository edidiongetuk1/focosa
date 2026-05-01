import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { matricNumber, department, level, idCardUrl } = body;

    if (!matricNumber) {
      return NextResponse.json(
        { error: "Missing matric number" },
        { status: 400 }
      );
    }

    const existing = await prisma.verificationRequest.findFirst({
      where: {
        userId: parseInt(user.sub),
        status: { in: ["pending", "approved"] },
      },
      orderBy: { submittedAt: "desc" },
    });

    if (existing && existing.status === "approved") {
      return NextResponse.json(
        { error: "Account already verified" },
        { status: 400 }
      );
    }

    if (existing && existing.status === "pending") {
      return NextResponse.json(
        { error: "A verification request is already pending review" },
        { status: 400 }
      );
    }

    const verification = await prisma.verificationRequest.create({
      data: {
        userId: parseInt(user.sub),
        fullName: user.email,
        matricNumber,
        department,
        level,
        idCardUrl,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        id: verification.id,
        message: "Verification request submitted. An admin will review shortly.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Verification submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
