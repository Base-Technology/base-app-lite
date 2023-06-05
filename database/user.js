import SQLite from './sqlite';
import { get } from '../utils/request';

export async function queryUserByIMTPUserID(imtp_user_id) {
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`SELECT * FROM "users" WHERE "imtp_user_id" = ?`, [imtp_user_id]);
    if (results.rows.length > 0) {
        return results.rows.item(0);
    }
    try {
        const res = await get(`/api/v1/user?imtp_user_id=${imtp_user_id}`);
        if (res.code != 0) {
            throw new Error(res.message);
        }
        const user = res.user;
        await addUser(user.id, user.username, user.area, user.school, user.introduction, user.avatar, user.imtp_user_id);
        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function addUser(id, username, area, school, introduction, avatar, imtp_user_id) {
    const sqlite = SQLite.getInstance();
    await sqlite.executeSql(`INSERT INTO "users" VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, username, area, school, introduction, avatar, imtp_user_id]);
}
