const {PrismaClient} = require('prisma/prisma-client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'chrisdev@gmail.com'; // Change this to your desired admin email
  const password = 'librongjames2018'; // Change this to your desired password

  // Check if the admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin already exists.');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the admin user
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
