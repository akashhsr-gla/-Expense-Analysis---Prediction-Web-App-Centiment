require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Models/User");
const Income = require("./Models/Income");
const Expense = require("./Models/Expense");

const MONGO_URI = process.env.MONGO_URI;

const userEmail = "man@gmail.com";
const userPassword = "Man12345@";
const userFullName = "Man Sharma";

const incomeItems = [
  { source: "Monthly Salary", amount: 65000, icon: "💼" },
  { source: "Freelance Project - Website", amount: 12000, icon: "🧑‍💻" },
  { source: "Stock Dividends", amount: 2200, icon: "📈" },
  { source: "Interest - Savings", amount: 900, icon: "🏦" },
  { source: "Sold Old Phone", amount: 4500, icon: "📱" },
  { source: "Referral Bonus", amount: 1500, icon: "🎉" },
  { source: "Part-time Tutoring", amount: 4000, icon: "📚" },
  { source: "Cashback/Rewards", amount: 600, icon: "💳" },
  { source: "Freelance Design", amount: 8000, icon: "🎨" },
  { source: "Gift Received", amount: 2000, icon: "🎁" },
  { source: "Crypto Yield", amount: 1200, icon: "🪙" },
  { source: "Blog Ad Revenue", amount: 1800, icon: "📰" },
  { source: "Consulting", amount: 7000, icon: "🗣️" },
  { source: "YouTube Revenue", amount: 2500, icon: "▶️" },
  { source: "Selling Furniture", amount: 3500, icon: "🛋️" },
  { source: "Freelance API Work", amount: 6500, icon: "🧩" },
  { source: "Stock Profit", amount: 5000, icon: "📊" },
  { source: "Bank Interest FD", amount: 1300, icon: "🏦" },
  { source: "Mentoring Session", amount: 2200, icon: "👨‍🏫" },
  { source: "Sold Bicycle", amount: 2800, icon: "🚲" },
];

const expenseItems = [
  { category: "Groceries", amount: 4200, icon: "🛒" },
  { category: "Rent", amount: 18000, icon: "🏠" },
  { category: "Electricity Bill", amount: 1800, icon: "💡" },
  { category: "Internet", amount: 900, icon: "🌐" },
  { category: "Mobile Recharge", amount: 399, icon: "📶" },
  { category: "Transport - Fuel", amount: 2500, icon: "⛽" },
  { category: "Dining Out", amount: 1600, icon: "🍽️" },
  { category: "Gym Membership", amount: 1200, icon: "🏋️" },
  { category: "Streaming Subscriptions", amount: 799, icon: "📺" },
  { category: "Household Supplies", amount: 950, icon: "🧴" },
  { category: "Medical - Pharmacy", amount: 750, icon: "💊" },
  { category: "Clothing", amount: 2100, icon: "👕" },
  { category: "Taxi/Auto", amount: 650, icon: "🚕" },
  { category: "Snacks & Coffee", amount: 480, icon: "☕" },
  { category: "Gift", amount: 1200, icon: "🎁" },
  { category: "Education Course", amount: 3500, icon: "🎓" },
  { category: "Maintenance - Bike", amount: 1100, icon: "🛠️" },
  { category: "Books", amount: 700, icon: "📘" },
  { category: "Travel - Bus/Train", amount: 1700, icon: "🚌" },
  { category: "Entertainment - Movies", amount: 600, icon: "🎬" },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

async function run() {
  if (!MONGO_URI) {
    console.error("MONGO_URI missing in env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, {});
  console.log("Connected to MongoDB");

  // Upsert user
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    user = new User({ fullName: userFullName, email: userEmail, password: userPassword });
    await user.save();
    console.log("Created user:", userEmail);
  } else {
    console.log("User already exists:", userEmail);
  }

  // Clean existing seeded data for this user (in test collection)
  await Income.deleteMany({ userId: user._id });
  await Expense.deleteMany({ userId: user._id });

  // Insert incomes spaced over last 60 days
  const incomes = incomeItems.map((item, idx) => ({
    userId: user._id,
    source: item.source,
    amount: item.amount,
    icon: item.icon,
    date: daysAgo(60 - idx * 3),
  }));

  // Insert expenses spaced over last 60 days
  const expenses = expenseItems.map((item, idx) => ({
    userId: user._id,
    category: item.category,
    amount: item.amount,
    icon: item.icon,
    date: daysAgo(60 - idx * 2),
  }));

  await Income.insertMany(incomes);
  await Expense.insertMany(expenses);
  console.log(`Inserted ${incomes.length} incomes and ${expenses.length} expenses`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


