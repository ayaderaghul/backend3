import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const currentUser = await db.user.findFirst();

  const followedIds = await db.follow.findMany({
    where: { follower_id: "084e5a12-7716-40f5-a1ee-11600ebaee2a" },
    select: { followee_id: true }
  });

  const timeline = await db.tweet.findMany({
    where: {
      user_id: { in: followedIds.map(f => f.followee_id) }
    },
    orderBy: { created_at: 'desc' },
    take: 20
  });

  console.log(timeline);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
