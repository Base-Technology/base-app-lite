import SQLite from './sqlite';

export async function queryUserByIMTPUserID(imtp_user_id) {
    const sqlite = SQLite.getInstance();
    const results = await sqlite.executeSql(`SELECT * FROM "imtp_user_id" WHERE "imtp_user_id" = ?`, [imtp_user_id]);
    return results.rows.length > 0 ? results.rows.item(0) : undefined;
}

export async function addUser(id, username, area, school, introduction, avatar, imtp_user_id) {
    const sqlite = SQLite.getInstance();
    await sqlite.executeSql(`INSERT INTO "user" VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, username, area, school, introduction, avatar, imtp_user_id]);
}
