import SQLite from './sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function queryMessage(group_id, timestamp, callback) {
    if (!group_id) {
        group_id = await AsyncStorage.getItem('group_id');
    }
    if (!timestamp) {
        timestamp = 4503599627370495;
    }
    const userID = await AsyncStorage.getItem('user_id');
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`SELECT * FROM "chatgpt" WHERE "group_id" = ? AND "timestamp" < ? ORDER BY "timestamp" DESC LIMIT 10`, [group_id, timestamp]);
    const messages = [];

    for (let i = results.rows.length - 1; i >= 0; i--) {
        const message = results.rows.item(i);
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
    const results = await sqlite.executeSql(`SELECT * FROM "chatgpt" ORDER BY "timestamp" DESC limit 1`);
    return results.rows.item(0);
}

export async function addMessage(message, callback) {
    const userID = await AsyncStorage.getItem('user_id');
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`INSERT into "chatgpt" VALUES (?,?,?,?,?,?,?)`,
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