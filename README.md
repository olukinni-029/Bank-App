# Bank-App
CRUD API, showing ACID Transaction of MongoDB.
This is a basic CRUD API that uses ACID transactions with MongoDB. ACID transactions are used to ensure data consistency and integrity in the database, and are an important feature for any production-level application.
## Getting started
To get started, you will need to have MongoDB installed on your system. You can download and install MongoDB from the official website at https://www.mongodb.com/.

You will also need to install the following dependencies:

1. Node.js
2. Express.js
3. Mongoose
To install these dependencies, you can use npm by running the following command:
```
npm install express mongoose
```
## API Endpoint
This CRUD API supports the following endpoints:
- POST/api/signup - Create a new user/wallet.
- POST/api/login - Login to wallet.
- POST/api/adminLogin/isAuth - Admin login route.
- POST/api/deposit - 
- POST/api/withdraw - 
- GET/api/isAuth - Retrieve all wallet.
- GET/api/withdraw/isAuth - Retrieve all withdrawal Transaction.
- GET/api/deposit/isAuth - Retrieve all deposit Transaction.
- GET/api/wallet/:id - Retrieve a single user/wallet by ID.
- PUT/api/wallet/:id - Update a user/wallet by ID.
- DELETE/api/wallet/:id - Delete a user/wallet by ID.
## ACID Transactions
ACID transactions are used to ensure data consistency and integrity in the database. MongoDB supports ACID transactions for multi-document transactions in replica sets and sharded clusters.

ACID stands for:

- Atomicity: All operations in a transaction are performed or none of them are performed.
- Consistency: A transaction brings the database from one valid state to another.
- Isolation: Each transaction is isolated from other transactions.
- Durability: Once a transaction is committed, the changes made by the transaction are permanent.

To use ACID transactions with MongoDB, you can use the `session` object provided by the `mongoose` library. Here's an example of how to use ACID transactions in a POST request:
```
app.post('/api/deposit',async(req,res)=>{
const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username, amount, summary } = req.body;
    const reference = v4();

    if (!username && !amount && !summary) {
      return res.status(400).json({
        message:
          "Please provide the following details: username, amount, summary",
      });
    }

    const depositResult = await creditAccount({
      amount,
      username: username,
      purpose: "deposit",
      reference,
      summary,
      trnxSummary: `DEPOSIT INTO: ${username}. TRNX REF:${reference} `,
      session,
    });

    if (depositResult.status !== true) {
      await session.abortTransaction();
      session.endSession();
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: "Deposit successful",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `Unable to find perform deposit. Please try again. \n Error: ${err}`,
    });
  }
});
```
In this example, we start a new session and transaction using `mongoose.startSession()`.
If the update is successful, we commit the transaction using `session.commitTransaction()`. If there is an error, we abort the transaction using `session.abortTransaction()`.
## Conclusion
This CRUD API with ACID transactions using MongoDB provides a basic example of how to use ACID transactions with MongoDB in a Node.js application. ACID transactions are an important feature for ensuring data consistency and integrity in production-level applications, and should be used whenever possible.
