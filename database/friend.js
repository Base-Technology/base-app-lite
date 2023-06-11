import SQLite from './sqlite';
import { get } from '../utils/request';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadFriends() {
    const sqlite = SQLite.getInstance();
    const userID = await AsyncStorage.getItem('user_id');

    const resp = await get('/api/v1/friend');
    if (resp.code != "0") {
        return;
    }

    for (let i = 0; i < resp.data.length; i++) {
        const imtp_user_id = resp.data[i].IMTPUserID;
        const results = await sqlite.executeSql(`SELECT * FROM "friend_${userID}" WHERE "imtp_user_id" = ?`, [imtp_user_id]);
        if (results.rows.length > 0) {
            continue;
        }
        try {
            const res = await get(`/api/v1/user?imtp_user_id=${imtp_user_id}`);
            if (res.code != 0) {
                throw new Error(res.message);
            }
            const user = res.user;
            await addFriend(user.id, user.username, user.area, user.school, user.introduction, user.avatar, user.imtp_user_id);
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
}

export async function addFriend(id, username, area, school, introduction, avatar, imtp_user_id) {
    const sqlite = SQLite.getInstance();
    const userID = await AsyncStorage.getItem('user_id');
    await sqlite.executeSql(`INSERT INTO "friend_${userID}" VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, username, area, school, introduction, avatar, imtp_user_id]);
}
