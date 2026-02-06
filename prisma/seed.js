import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  // hash password
  const hashedPassword = await bcrypt.hash("Ninah256", 10);

  // upsert ensures user exists, avoids unique constraint errors
  await prisma.user.upsert({
    where: { email: "ninah@email.com" },
    update: {
  password: hashedPassword,
  changePassword: false
},

    create: {
      username: "Ninah",
      email: "ninah@email.com",
      password: hashedPassword,
      role: "ADMIN",
      changePassword: false
    },
  });

  console.log("CI test user ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
