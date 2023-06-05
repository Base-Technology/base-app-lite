import SQLite from './sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryUserByIMTPUserID } from './user';

export async function queryMessage(group_id, timestamp, callback) {
    if (!group_id) {
        group_id = await AsyncStorage.getItem('group_id');
    }
    if (!timestamp) {
        timestamp = 4503599627370495;
    }
    const userID = await AsyncStorage.getItem('user_id');
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`SELECT "message_${userID}".*, "users".username, "users".avatar FROM "message_${userID}" LEFT JOIN "users" ON "message_${userID}"."imtp_user_id" = "users"."imtp_user_id" WHERE "group_id" = ? AND "timestamp" < ? ORDER BY "timestamp" DESC LIMIT 10`,
        [group_id, timestamp]);
    const messages = [];
    for (let i = results.rows.length - 1; i >= 0; i--) {
        const message = results.rows.item(i);
        if (message.is_send == 0 && !message.username) {
            await queryUserByIMTPUserID(message.imtp_user_id);
        }
        messages.push(message);
    }
    if (callback) {
        callback(messages);
    }
    return messages;
}

export async function queryLastMessage() {
    const userID = await AsyncStorage.getItem('user_id');
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`SELECT * FROM "message_${userID}" ORDER BY "timestamp" DESC limit 1`);
    return results.rows.item(0);
}

export async function addMessage(message, callback) {
    const userID = await AsyncStorage.getItem('user_id');
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`INSERT into "message_${userID}" VALUES (?,?,?,?,?,?,?)`,
        [message.id, message.state, message.timestamp, message.group_id, message.imtp_user_id, message.is_send, message.content],
    );
    if (callback) {
        callback(message);
    }
}

export async function createMessageTable(userID) {
    const sqlite = SQLite.getInstance();
    await sqlite.createMessageTable(userID);
}