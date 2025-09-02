const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🗄️ FWFPS - Field Work Force Planning System');
console.log('Database Location Check\n');

const dbPath = './fwfps.db';

// Check if database file exists
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
    console.log('❌ Database file not found!');
    process.exit(1);
}

console.log('✅ Database file found!');
console.log(`📍 Location: ${path.resolve(dbPath)}\n`);

// Connect and check tables
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        return;
    }
    console.log('🔗 Connected to FWFPS SQLite database\n');
});

// List all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
        console.error('❌ Error querying tables:', err.message);
        return;
    }
    
    console.log('📋 Database Tables:');
    if (rows.length === 0) {
        console.log('   (No tables found)');
    } else {
        rows.forEach(row => {
            console.log(`   📊 ${row.name}`);
        });
    }
    
    // Count records in each table
    if (rows.length > 0) {
        console.log('\n📈 Record Counts:');
        let completed = 0;
        rows.forEach(table => {
            db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, row) => {
                if (err) {
                    console.log(`   ${table.name}: Error - ${err.message}`);
                } else {
                    console.log(`   ${table.name}: ${row.count} records`);
                }
                completed++;
                if (completed === rows.length) {
                    console.log('\n✅ Database check complete!');
                    db.close();
                }
            });
        });
    } else {
        db.close();
    }
});
