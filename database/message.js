import SQLite from './sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function queryMessage(group_id, callback) {
    if (!group_id) {
        group_id = await AsyncStorage.getItem('group_id');
    }
    const userID = await AsyncStorage.getItem('user_id');
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`SELECT * FROM "message_${userID}" WHERE "group_id" = ? ORDER BY "timestamp"`, [group_id]);
    const messages = [];
    for (let i = 0; i < results.rows.length; i++) {
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