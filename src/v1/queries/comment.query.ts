const DATA_SELECT = `
JSON_OBJECT(
	'id', _id,
    'content', content,
    'equipment_id', equipment_id,
	'unit_id', unit_id,
    'created_at', created_at,
    'updated_at', updated_at,
    'response_to', response_to,
    'user', user
) data
`

export const CommentQueries = {
    insertUnitComment: `
        INSERT INTO comments (content, user, unit_id) VALUES (?, ?, ?);
    `,
    insertEquipComment: `
        INSERT INTO comments (content, user, equipment_id) VALUES (?, ?, ?)
    `,
    insertUnitCommentResponse: `
        INSERT INTO comments (content, user, unit_id, response_to) VALUES (?, ?, ?, ?);
    `,
    insertEquipCommentResponse: `
        INSERT INTO comments (content, user, equipment_id, response_to) VALUES (?, ?, ?, ?);
    `,
    deleteComment: `
        UPDATE comments 
        SET state = 0 
        WHERE _id = ? AND user = ? 
    `,
    updateComment: `
        UPDATE comments 
        SET content = ?, updated_at = datetime('now')
        WHERE _id = ? AND user = ? 
    `,
    selectCommentsByUnit: `
SELECT ${DATA_SELECT}
FROM comments
WHERE state = 1 AND unit_id = ?
ORDER BY created_at
    `,
    selectCommentsByEquip: `
SELECT ${DATA_SELECT}
FROM comments
WHERE state = 1 AND equipment_id = ?
ORDER BY created_at
    `,
    selectCommentsByUser: `
SELECT ${DATA_SELECT}
FROM comments
WHERE user = ?
ORDER BY created_at
    `
}