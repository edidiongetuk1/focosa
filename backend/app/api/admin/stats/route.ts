import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const [users, departments, lecturers, events, announcements, resources, listings, verifications] = await Promise.all([
      prisma.user.count(),
      prisma.department.count(),
      prisma.lecturer.count(),
      prisma.event.count(),
      prisma.announcement.count(),
      prisma.resource.count(),
      prisma.listing.count(),
      prisma.verificationRequest.count(),
    ]);

    const pending_listings = await prisma.listing.count({
      where: { status: "pending" },
    });

    const pending_verifications = await prisma.verificationRequest.count({
      where: { status: "pending" },
    });

    return NextResponse.json({
      users,
      departments,
      lecturers,
      events,
      announcements,
      resources,
      listings,
      pending_listings,
      pending_verifications,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
