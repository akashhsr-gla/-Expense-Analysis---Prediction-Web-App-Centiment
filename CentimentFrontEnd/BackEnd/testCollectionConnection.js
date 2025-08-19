require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Models/User");
const Expense = require("./Models/Expense");
const Income = require("./Models/Income");

const testCollectionConnection = async () => {
    try {
        console.log("🔧 Testing connection to 'test' collection...\n");
        
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("✅ MongoDB Connected Successfully!");
        
        // Check which collections are being used
        console.log("\n📚 Collection Information:");
        console.log(`User model collection: ${User.collection.name}`);
        console.log(`Expense model collection: ${Expense.collection.name}`);
        console.log(`Income model collection: ${Income.collection.name}`);
        
        // List all collections in the database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("\n📋 All collections in database:");
        collections.forEach(collection => {
            console.log(`   - ${collection.name}`);
        });
        
        // Count documents in the test collection for each model
        console.log("\n📊 Document counts in 'test' collection:");
        
        // Since all models now use the same collection, we need to count by document type
        const allTestDocs = await mongoose.connection.db.collection('test').find({}).toArray();
        console.log(`   - Total documents in 'test' collection: ${allTestDocs.length}`);
        
        // Try to identify document types by their structure
        let userCount = 0;
        let expenseCount = 0;
        let incomeCount = 0;
        
        allTestDocs.forEach(doc => {
            if (doc.email && doc.fullName) {
                userCount++;
            } else if (doc.category && doc.amount && !doc.source) {
                expenseCount++;
            } else if (doc.source && doc.amount && !doc.category) {
                incomeCount++;
            }
        });
        
        console.log(`   - Users (documents with email/fullName): ${userCount}`);
        console.log(`   - Expenses (documents with category): ${expenseCount}`);
        console.log(`   - Income (documents with source): ${incomeCount}`);
        
        // Show sample documents
        if (allTestDocs.length > 0) {
            console.log("\n📝 Sample documents from 'test' collection:");
            allTestDocs.slice(0, 3).forEach((doc, index) => {
                console.log(`   Document ${index + 1}:`, {
                    _id: doc._id,
                    type: doc.email ? 'User' : doc.category ? 'Expense' : doc.source ? 'Income' : 'Unknown',
                    fields: Object.keys(doc).filter(key => !key.startsWith('_')).slice(0, 3)
                });
            });
        }
        
        console.log("\n✅ Test collection connection successful!");
        console.log("ℹ️  Note: All User, Expense, and Income data will now be stored in the 'test' collection");
        
    } catch (err) {
        console.error("❌ Error testing collection connection:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
};

testCollectionConnection();
