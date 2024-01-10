// import mongoose from 'mongoose';
import { Sequelize } from "sequelize"
import dotenv from 'dotenv';
dotenv.config();

// ==> CONNECTION TO MYSQL DATABASE

const db = new Sequelize( 
  {
    dialect   : "mysql",
    logging   : false,
    database  : process.env.db_database,
    username  : process.env.db_username,
    password  : process.env.db_password,
    host      : process.env.db_host,
  }
)

export default db

// ==> CONNECTION TO MONGODB DATABASE

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.mongourl);
//     console.log(`==> database connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error.message);
//     process.exit(1);
//   }
// };
// export default connectDB;