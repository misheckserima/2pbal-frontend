import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema.js';

// Database connection
const sql = neon(process.env.NEON_DATABASE_URL);
const db = drizzle(sql, { schema });

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        company VARCHAR(200),
        phone VARCHAR(20),
        job_title VARCHAR(150),
        industry VARCHAR(100),
        company_size VARCHAR(50),
        website VARCHAR(255),
        address TEXT,
        business_goals TEXT,
        current_challenges TEXT,
        preferred_budget VARCHAR(50),
        project_timeline VARCHAR(50),
        referral_source VARCHAR(100),
        marketing_consent BOOLEAN DEFAULT FALSE,
        profile_complete BOOLEAN DEFAULT FALSE,
        recommended_package VARCHAR(100),
        recommendation_score INTEGER,
        recommendation_reason TEXT,
        recommendation_date TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'user',
        avatar TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        preferences JSONB DEFAULT '{"theme": "light", "notifications": true, "language": "en", "timezone": "UTC"}',
        subscription JSONB,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Users table created');

    // Create user_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ User sessions table created');

    // Create email_verification_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Email verification tokens table created');

    // Create package_view_tracking table
    await sql`
      CREATE TABLE IF NOT EXISTS package_view_tracking (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255),
        package_name VARCHAR(100) NOT NULL,
        package_type VARCHAR(100) NOT NULL,
        view_duration INTEGER,
        page_url VARCHAR(500),
        user_agent TEXT,
        last_reminder_sent TIMESTAMP,
        view_count INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Package view tracking table created');

    // Create quotes table
    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        company TEXT,
        phone TEXT,
        goals JSONB NOT NULL,
        overspending JSONB NOT NULL,
        outcomes JSONB NOT NULL,
        project_description TEXT NOT NULL,
        budget_range VARCHAR(50),
        timeline VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Quotes table created');

    console.log('🎉 All database tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
