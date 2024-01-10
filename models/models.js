import { DataTypes, STRING } from "sequelize";
import db from "../config/database.js";
// (async() => await db.sync())()

export const users = db.define("users",
    {
        username : DataTypes.STRING,
        password : DataTypes.STRING,
        reftoken : DataTypes.STRING,
        agent    : DataTypes.STRING,
        email    : DataTypes.STRING,
        img      : DataTypes.STRING,
        vid       : DataTypes.STRING,
    },
    {
        freezeTableName : true
    }
)

export const contributor = db.define("contributor",
    {
        username : DataTypes.STRING,
        password : DataTypes.STRING,
        reftoken : DataTypes.STRING,
        amount   : DataTypes.INTEGER,
        agent    : DataTypes.STRING,
        email    : DataTypes.STRING,
        img      : DataTypes.STRING,
        vid      : DataTypes.STRING,
    },
    {
        freezeTableName: true
    }
)

export const products = db.define('products',
    {
        price   : DataTypes.INTEGER,
        title   : DataTypes.STRING,
        desc    : DataTypes.STRING,
        file    : DataTypes.STRING,
        img     : DataTypes.STRING,
        ctg     : DataTypes.STRING,
        vid     : DataTypes.STRING,
        by      : DataTypes.STRING,
    },
    {
        freezeTableName : true,
    }
)

export const waiting = db.define('request',
    {
        price   : DataTypes.INTEGER,
        title   : DataTypes.STRING,
        desc    : DataTypes.STRING,
        file    : DataTypes.STRING,
        img     : DataTypes.STRING,
        ctg     : DataTypes.STRING,
        vid     : DataTypes.STRING,
        by      : DataTypes.STRING,
    },
    {
        freezeTableName : true
    }
)