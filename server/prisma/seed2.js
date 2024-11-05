const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: "JS learning path",
        content:
          "This blog post describes the path to learning JS in 7 months.",
        authorId: 1,
      },
      {
        title: "Building MJA app",
        content: "Building of the MJA MVP for alpha testing.",
        authorId: 1,
      },
      {
        title: "Building House",
        content: "Constructing house in Brazil while at it.",
        authorId: 1,
      },
    ],
  });
  console.log("Post created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
