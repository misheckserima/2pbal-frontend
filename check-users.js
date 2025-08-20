import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_4tf7ILEBVdSR@ep-plain-glade-a2pnm2q0-pooler.eu-central-1.aws.neon.tech/2pbaladmin_database?sslmode=require&channel_binding=require');

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    // Check if users table exists and has data
    const result = await sql`
      SELECT 
        COUNT(*) as total_users,
        MAX(created_at) as latest_signup
      FROM users;
    `;
    
    console.log('📊 Database Results:');
    console.log(`Total users: ${result[0].total_users}`);
    console.log(`Latest signup: ${result[0].latest_signup || 'No users yet'}`);
    
    // Get recent users
    const users = await sql`
      SELECT id, email, first_name, last_name, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5;
    `;
    
    if (users.length > 0) {
      console.log('\n👥 Recent users:');
      users.forEach(user => {
        console.log(`- ${user.email} (${user.first_name} ${user.last_name}) - ${user.created_at}`);
      });
    } else {
      console.log('\n❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  }
}

checkUsers();
