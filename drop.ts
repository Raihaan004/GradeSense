import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql.query('DROP TABLE IF EXISTS risk_profiles CASCADE;');
  await sql.query('DROP TABLE IF EXISTS students CASCADE;');
  console.log('Tables dropped successfully');
}
main();
