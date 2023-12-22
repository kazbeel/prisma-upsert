import { PrismaClient, User } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const firstUser = await getOrCreateFirstUser();

  for (let i = 0; i < 100; i++) {
    const update = Math.random() < 0.5;
    const name = randomUUID();
    const email = update ? firstUser.email : randomUUID();

    const user = await upsertUser(name, email);

    console.log(
      `User ${update ? "updated" : "created"}: ID=${user.id} email=${
        user.email
      } name=${user.name}`,
    );
  }
}

async function getOrCreateFirstUser(): Promise<User> {
  let firstUser = await prisma.user.findUnique({ where: { id: 1 } });

  if (!firstUser) {
    const name = randomUUID();
    const email = randomUUID();

    firstUser = await prisma.user.create({ data: { name, email } });
  }

  return firstUser;
}

function upsertUser(name: string, email: string): Promise<User> {
  return prisma.user.upsert({
    where: { email },
    create: { name, email },
    update: { name, email },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
