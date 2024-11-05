const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: "yevkho",
      password: "1234567",
      email: "yevkho@gmail.com",
      role: "ADMIN",
    },
  });
  console.log("User created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
