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
        SELECT 
            _id,
            content,
            unit_id,
            created_at,
            updated_at,
            response_to,
            user
        FROM comments
        WHERE state = 1 AND unit_id = ?
        ORDER BY created_at
    `,
    selectCommentsByEquip: `
        SELECT 
            _id,
            content,
            equipment_id,
            created_at,
            updated_at,
            response_to,
            user
        FROM comments
        WHERE state = 1 AND equipment_id = ?
        ORDER BY created_at
    `,
    selectCommentsByUser: `
        SELECT 
            _id,
            content,
            unit_id,
            equipment_id
            created_at,
            updated_at,
            response_to,
            user
        FROM comments
        WHERE user = ?
        ORDER BY created_at
    `
}