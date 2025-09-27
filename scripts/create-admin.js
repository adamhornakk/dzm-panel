const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('👑 Creating admin user...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', existingAdmin.email);
    return;
  }

  const adminEmail = 'admin@dikyzemuzem.cz';
  const adminPassword = 'admin123'; // Change this in production!
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'Administrátor komunity Díky že můžem! 2025/2026',
          isPublic: true
        }
      }
    }
  });

  console.log('🎉 Admin user created successfully!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('⚠️  IMPORTANT: Change the password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
