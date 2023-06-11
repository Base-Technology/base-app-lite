import SQLiteStorage from 'react-native-sqlite-storage';
import sql from 'react-native-sqlite-storage';
import 'react-native-get-random-values';
import '@ethersproject/shims';

const database_name = "base.db";
const database_version = "1.0";
const database_displayname = "Base";
const database_size = -1;

export default class SQLite {

    static instance;

    static getInstance() {
        if (!SQLite.instance) {
            SQLite.instance = new SQLite();
        }
        return SQLite.instance;
    }

    async open() {
        if (!this.openCompleted) {
            this.openCompleted = true;

            sql.enablePromise(true);
            this.db = await SQLiteStorage.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
                () => {
                    console.log(`sqlite open success`);
                },
                (err) => {
                    console.log(`sqlite open failed: ${err}`);
                });

            await this.initDatabase();
        }
    }

    async initDatabase() {
        await this.executeSql(`CREATE TABLE IF NOT EXISTS "users" (
            "id" integer NOT NULL,
            "username" TEXT,
            "area" TEXT,
            "school" TEXT,
            "introduction" TEXT,
            "avatar" TEXT,
            "imtp_user_id" TEXT,
            PRIMARY KEY ("id")
          )`);
        await this.executeSql(`CREATE TABLE IF NOT EXISTS "chatgpt" (
            "id" text NOT NULL,
            "state" integer,
            "timestamp" DATE,
            "group_id" text,
            "imtp_user_id" text,
            "is_send" integer,
            "content" text,
            PRIMARY KEY ("id")
          )`);
    }
    async createMessageTable(userID) {
        await this.executeSql(`CREATE TABLE IF NOT EXISTS "message_${userID}" (
            "id" text NOT NULL,
            "state" integer,
            "timestamp" DATE,
            "group_id" text,
            "imtp_user_id" text,
            "is_send" integer,
            "content" text,
            PRIMARY KEY ("id")
          )`);
        await this.executeSql(`CREATE TABLE IF NOT EXISTS "friend_${userID}" (
            "id" integer NOT NULL,
            "username" TEXT,
            "area" TEXT,
            "school" TEXT,
            "introduction" TEXT,
            "avatar" TEXT,
            "imtp_user_id" TEXT,
            PRIMARY KEY ("id")
          )`);
    }

    async executeSql(sql, params) {
        if (!this.openCompleted) {
            await this.open();
        }
        const result = await this.db.executeSql(sql, params);
        return result[0];
    }

    async close() {
        if (this.openCompleted) {
            await this.db.close();
            console.log(`sqlite close success`);
        } else {
            console.log(`sqlite not open`);
        }
        this.db = null;
    }
};