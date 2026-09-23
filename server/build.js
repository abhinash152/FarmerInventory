const { execSync } = require('child_process');

// Ensure DATABASE_URL is set so Prisma never fails due to missing environment variable
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('🌾 Building FarmerInventory Server...');
console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

try {
  console.log('📦 1/3 Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

  console.log('🔄 2/3 Syncing database schema with prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });

  console.log('⚡ 3/3 Compiling TypeScript with tsc...');
  execSync('npx tsc', { stdio: 'inherit', env: process.env });

  console.log('✅ Server built successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
