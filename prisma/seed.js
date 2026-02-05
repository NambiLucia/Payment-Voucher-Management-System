// import pkg from "@prisma/client";
// const { PrismaClient } = pkg;
// const prisma = new PrismaClient();
// import bcrypt from "bcrypt";

// async function main() {
//   // hash password
//   const hashedPassword = await bcrypt.hash("Test256", 10);

//   // upsert ensures user exists, avoids unique constraint errors
//   await prisma.user.upsert({
//     where: { email: "testuser@email.com" },
//     update: {},
//     create: {
//       username: "TestUser",
//       email: "testuser@email.com",
//       password: hashedPassword,
//       role: "ADMIN",
//     },
//   });

//   console.log("CI test user ready");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
