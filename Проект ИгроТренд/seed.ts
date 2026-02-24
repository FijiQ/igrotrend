import { db } from './src/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

async function seed() {
  console.log('🌱 Seeding database...');

  // Get credentials from environment or use defaults for development
  const devEmail = process.env.DEV_EMAIL || 'dev@igrotrend.local';
  const devPassword = process.env.DEV_PASSWORD || randomBytes(8).toString('hex');
  const devUsername = process.env.DEV_USERNAME || 'developer';

  // Check if developer already exists
  const existingDev = await db.user.findUnique({
    where: { email: devEmail },
  });

  if (existingDev) {
    console.log('✅ Developer account already exists');
    console.log('   Email:', devEmail);
    console.log('   Role:', existingDev.role);
    return;
  }

  // Create developer account
  const hashedPassword = await bcrypt.hash(devPassword, 12);

  const developer = await db.user.create({
    data: {
      email: devEmail,
      username: devUsername,
      displayName: '🔑 Developer',
      password: hashedPassword,
      language: 'RU',
      emailStatus: 'VERIFIED',
      role: 'DEVELOPER',
      level: 100,
      exp: 9999,
      coins: 99999,
      bio: 'Аккаунт разработчика платформы ИгроТренд',
    },
  });

  console.log('✅ Developer account created:');
  console.log('   Email:', devEmail);
  console.log('   Password:', devPassword);
  console.log('   Username:', developer.username);
  console.log('   Role:', developer.role);

  if (!process.env.DEV_PASSWORD) {
    console.log('\n⚠️  IMPORTANT: Save this password securely!');
    console.log('   For production, set DEV_PASSWORD environment variable.');
  }

  console.log('\n🎉 Seed completed!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
