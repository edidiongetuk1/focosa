import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const where = status ? { status } : {};
    const requests = await prisma.verificationRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("List verification requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { status: newStatus, adminNote } = body;
    const verificationId = parseInt(id);
    if (!["approved", "rejected"].includes(newStatus)) {
      return NextResponse.json(
        { error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }
    const verification = await prisma.verificationRequest.findUnique({
      where: { id: verificationId },
    });
    if (!verification) {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      );
    }
    await prisma.verificationRequest.update({
      where: { id: verificationId },
      data: {
        status: newStatus,
        adminNote,
        reviewedAt: new Date(),
      },
    });
    if (newStatus === "approved") {
      await prisma.user.update({
        where: { id: verification.userId },
        data: {
          isVerified: true,
          matricNumber: verification.matricNumber,
          department: verification.department,
          level: verification.level,
        },
      });
    }
    return NextResponse.json({ message: `Verification request ${newStatus}` });
  } catch (error) {
    console.error("Review verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const verificationId = parseInt(id);
    await prisma.verificationRequest.delete({
      where: { id: verificationId },
    });
    return NextResponse.json({ message: "Verification request deleted" });
  } catch (error) {
    console.error("Delete verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}