const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      fullName: "FOCOSA Admin",
      email: "admin@focosa.edu.ng",
      password: adminPassword,
      role: "admin",
      isVerified: true,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create demo student
  const studentPassword = await bcrypt.hash("student123", 10);
  const student = await prisma.user.create({
    data: {
      fullName: "John Doe",
      email: "student@focosa.edu.ng",
      password: studentPassword,
      role: "student",
      isVerified: false,
    },
  });
  console.log("✅ Student created:", student.email);

  // Seed departments
  const departments = [
    { name: "Computer Science", code: "CSC", hod: "Prof. Adeyemi", studentCount: 420, courseCount: 38 },
    { name: "Software Engineering", code: "SEN", hod: "Dr. Okafor", studentCount: 280, courseCount: 32 },
    { name: "Cybersecurity", code: "CYB", hod: "Dr. Ibrahim", studentCount: 195, courseCount: 28 },
    { name: "Information Technology", code: "IFT", hod: "Prof. Uche", studentCount: 352, courseCount: 35 },
  ];

  for (const dept of departments) {
    await prisma.department.create({ data: dept });
  }
  console.log("✅ Departments seeded");

  // Seed announcements
  const announcements = [
    { title: "Welcome to FOCOSA", content: "Welcome to our hub!", type: "General" },
    { title: "Semester Updates", content: "New semester begins next week", type: "Academic" },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
  }
  console.log("✅ Announcements seeded");

  // Seed sample listing
  await prisma.listing.create({
    data: {
      title: "MacBook Pro 13-inch",
      description: "Excellent condition, barely used",
      price: 500000,
      category: "Electronics",
      contact: "08012345678",
      sellerId: student.id,
      sellerName: student.fullName,
      status: "approved",
    },
  });
  console.log("✅ Sample listing created");

  console.log("🎉 Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
