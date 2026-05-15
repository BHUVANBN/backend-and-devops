import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// In Prisma 7, standard direct connections require a driver adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
