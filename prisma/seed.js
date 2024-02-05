const { PrismaClient } = require("@prisma/client");

// Data for the super admin for the Users table
// const users = [
//   {
//     fullName: 'Bia Benefits',
//     role: 'Super Admin',
//     type: 'Bia Benefit',
//     email: 'admin@biabenefits.ca',
//     active: true,
//   },
// ]; use the array if multiple users need to be added

async function main() {
  const prisma = new PrismaClient();

  try {
    const admin = await prisma.User.create({
      data: {
        name: "Bia Benefits",
        role: "SUPER_ADMIN",
        email: process.env.ADMIN_EMAIL,
        active: true,
      },
    });

    console.log("Seeded data:", admin);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {});
