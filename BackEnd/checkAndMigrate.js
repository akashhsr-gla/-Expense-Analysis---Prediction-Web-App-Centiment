require("dotenv").config();
const mongoose = require("mongoose");

const checkAndMigrate = async () => {
    try {
        console.log("🔍 Checking existing data and migrating to 'test' collection...\n");
        
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("✅ MongoDB Connected Successfully!");
        
        const db = mongoose.connection.db;
        
        // Check what's in each collection
        console.log("\n📊 Checking collection contents:");
        
        // Check expenses collection
        const expensesCount = await db.collection('expenses').countDocuments();
        console.log(`   - expenses collection: ${expensesCount} documents`);
        
        // Check incomes collection  
        const incomesCount = await db.collection('incomes').countDocuments();
        console.log(`   - incomes collection: ${incomesCount} documents`);
        
        // Check test collection
        const testCount = await db.collection('test').countDocuments();
        console.log(`   - test collection: ${testCount} documents`);
        
        // Show sample data from existing collections
        if (expensesCount > 0) {
            const sampleExpenses = await db.collection('expenses').find({}).limit(2).toArray();
            console.log("\n📝 Sample expenses data:");
            sampleExpenses.forEach((doc, i) => {
                console.log(`   ${i+1}. Category: ${doc.category}, Amount: ${doc.amount}, User: ${doc.userId}`);
            });
        }
        
        if (incomesCount > 0) {
            const sampleIncomes = await db.collection('incomes').find({}).limit(2).toArray();
            console.log("\n📝 Sample incomes data:");
            sampleIncomes.forEach((doc, i) => {
                console.log(`   ${i+1}. Source: ${doc.source}, Amount: ${doc.amount}, User: ${doc.userId}`);
            });
        }
        
        // Now migrate the data
        let totalMigrated = 0;
        
        if (expensesCount > 0) {
            const expenses = await db.collection('expenses').find({}).toArray();
            await db.collection('test').insertMany(expenses);
            console.log(`\n✅ Migrated ${expenses.length} expense documents to 'test' collection`);
            totalMigrated += expenses.length;
        }
        
        if (incomesCount > 0) {
            const incomes = await db.collection('incomes').find({}).toArray();
            await db.collection('test').insertMany(incomes);
            console.log(`✅ Migrated ${incomes.length} income documents to 'test' collection`);
            totalMigrated += incomes.length;
        }
        
        // Final verification
        const finalTestCount = await db.collection('test').countDocuments();
        console.log(`\n📊 Final Results:`);
        console.log(`   - Total documents migrated: ${totalMigrated}`);
        console.log(`   - Final count in 'test' collection: ${finalTestCount}`);
        
        // Show what's now in the test collection
        const testDocs = await db.collection('test').find({}).limit(5).toArray();
        if (testDocs.length > 0) {
            console.log(`\n📝 Documents now in 'test' collection:`);
            testDocs.forEach((doc, index) => {
                const docType = doc.category ? 'Expense' : doc.source ? 'Income' : doc.email ? 'User' : 'Unknown';
                const identifier = doc.category || doc.source || doc.email || 'Unknown';
                console.log(`   ${index + 1}. ${docType}: ${identifier} (Amount: ${doc.amount || 'N/A'})`);
            });
        }
        
        console.log("\n✅ Migration completed successfully!");
        console.log("🎯 Your application will now access all data from the 'test' collection");
        
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
};

checkAndMigrate();
