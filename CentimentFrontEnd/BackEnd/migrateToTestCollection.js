require("dotenv").config();
const mongoose = require("mongoose");

const migrateToTestCollection = async () => {
    try {
        console.log("🔄 Starting migration to 'test' collection...\n");
        
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("✅ MongoDB Connected Successfully!");
        
        const db = mongoose.connection.db;
        
        // Check existing collections
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        
        console.log("\n📋 Available collections:", collectionNames);
        
        let totalMigrated = 0;
        
        // Migrate users collection if it exists
        if (collectionNames.includes('users')) {
            const users = await db.collection('users').find({}).toArray();
            if (users.length > 0) {
                await db.collection('test').insertMany(users);
                console.log(`✅ Migrated ${users.length} user documents to 'test' collection`);
                totalMigrated += users.length;
            }
        }
        
        // Migrate expenses collection if it exists
        if (collectionNames.includes('expenses')) {
            const expenses = await db.collection('expenses').find({}).toArray();
            if (expenses.length > 0) {
                await db.collection('test').insertMany(expenses);
                console.log(`✅ Migrated ${expenses.length} expense documents to 'test' collection`);
                totalMigrated += expenses.length;
            }
        }
        
        // Migrate incomes collection if it exists
        if (collectionNames.includes('incomes')) {
            const incomes = await db.collection('incomes').find({}).toArray();
            if (incomes.length > 0) {
                await db.collection('test').insertMany(incomes);
                console.log(`✅ Migrated ${incomes.length} income documents to 'test' collection`);
                totalMigrated += incomes.length;
            }
        }
        
        // Check final count in test collection
        const testCount = await db.collection('test').countDocuments();
        
        console.log(`\n📊 Migration Summary:`);
        console.log(`   - Total documents migrated: ${totalMigrated}`);
        console.log(`   - Final count in 'test' collection: ${testCount}`);
        
        // Show sample documents from test collection
        const sampleDocs = await db.collection('test').find({}).limit(3).toArray();
        if (sampleDocs.length > 0) {
            console.log(`\n📝 Sample documents in 'test' collection:`);
            sampleDocs.forEach((doc, index) => {
                const docType = doc.email ? 'User' : doc.category ? 'Expense' : doc.source ? 'Income' : 'Unknown';
                console.log(`   ${index + 1}. ${docType}: ${doc._id}`);
            });
        }
        
        console.log("\n✅ Migration completed successfully!");
        console.log("ℹ️  Your application will now use data from the 'test' collection");
        
    } catch (err) {
        console.error("❌ Migration error:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
};

migrateToTestCollection();
