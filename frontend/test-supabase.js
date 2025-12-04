// Test Supabase connection and list tables
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n📊 Testing Database Connection...\n');

  // Test 1: Check if preshotcourses table exists
  console.log('Test 1: Querying preshotcourses table...');
  const { data: courses, error: coursesError } = await supabase
    .from('preshotcourses')
    .select('*')
    .limit(5);

  if (coursesError) {
    console.error('❌ Error querying preshotcourses:', coursesError.message);
    console.error('   Code:', coursesError.code);
    console.error('   Details:', coursesError.details);
    console.error('   Hint:', coursesError.hint);
  } else {
    console.log('✅ preshotcourses table found!');
    console.log('   Rows returned:', courses?.length || 0);
    if (courses && courses.length > 0) {
      console.log('   Sample course:', JSON.stringify(courses[0], null, 2));
    }
  }

  // Test 2: Check if old 'courses' table exists
  console.log('\nTest 2: Checking for old "courses" table...');
  const { data: oldCourses, error: oldError } = await supabase
    .from('courses')
    .select('*')
    .limit(1);

  if (oldError) {
    console.log('❌ Old "courses" table not found (expected)');
  } else {
    console.log('⚠️  Old "courses" table still exists!');
    console.log('   You may have created the wrong table.');
  }

  // Test 3: Check course_modules
  console.log('\nTest 3: Querying course_modules table...');
  const { data: modules, error: modulesError } = await supabase
    .from('course_modules')
    .select('*')
    .limit(5);

  if (modulesError) {
    console.error('❌ Error querying course_modules:', modulesError.message);
  } else {
    console.log('✅ course_modules table found!');
    console.log('   Rows returned:', modules?.length || 0);
  }

  // Test 4: Try to list all tables (requires proper permissions)
  console.log('\nTest 4: Attempting to list all tables...');
  try {
    const { data: tables, error: tablesError } = await supabase.rpc(
      'get_tables',
      {}
    );
    if (!tablesError && tables) {
      console.log('✅ Available tables:', tables);
    } else {
      console.log('ℹ️  Cannot list tables (requires custom function)');
    }
  } catch (e) {
    console.log('ℹ️  Cannot list tables (requires custom function)');
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 Summary:');
  console.log('='.repeat(60));
  
  if (!coursesError && courses && courses.length > 0) {
    console.log('✅ SUCCESS: Database is working and has course data!');
    console.log(`   Found ${courses.length} course(s)`);
    console.log('\n🎯 Next steps:');
    console.log('   1. The table exists and has data');
    console.log('   2. Check Row Level Security (RLS) policies');
    console.log('   3. Verify frontend .env.local has correct credentials');
  } else if (!coursesError && courses && courses.length === 0) {
    console.log('⚠️  Table exists but is EMPTY');
    console.log('\n🎯 Next steps:');
    console.log('   1. Run the INSERT statements from schema_courses.sql');
    console.log('   2. Verify RLS policies allow SELECT');
  } else {
    console.log('❌ FAILED: Table does not exist');
    console.log('\n🎯 Next steps:');
    console.log('   1. Run schema_courses.sql in Supabase SQL Editor');
    console.log('   2. Verify you selected the correct database/project');
    console.log('   3. Check for typos in table name');
  }
}

testConnection().catch(console.error);
