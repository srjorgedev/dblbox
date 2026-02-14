export const QUnits = {
    ReadAll: `
            SELECT 
                u._id AS unit_id,
                u._num AS unit_num,
                u.transform,
                u.lf,
                u.zenkai,
                u.tagswitch,
                GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
                GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
                GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
                GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
                GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts
            FROM unit u
                LEFT JOIN unit_name un ON un.unit = u._id
                LEFT JOIN rarity_texts r ON r.rarity = u.rarity
                LEFT JOIN type_texts t ON t.type = u.type
                LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter
                LEFT JOIN unit_color uc ON uc.unit = u._id
                LEFT JOIN color_texts ct ON ct.color = uc.color
            GROUP BY u._id
            ORDER BY u._id DESC
            `,
    ReadAllWithPages: `
            SELECT 
                u._id AS unit_id,
                u._num AS unit_num,
                u.transform,
                u.lf,
                u.zenkai,
                u.tagswitch,
                GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
                GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
                GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
                GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
                GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts
            FROM unit u
                LEFT JOIN unit_name un ON un.unit = u._id
                LEFT JOIN rarity_texts r ON r.rarity = u.rarity
                LEFT JOIN type_texts t ON t.type = u.type
                LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter
                LEFT JOIN unit_color uc ON uc.unit = u._id
                LEFT JOIN color_texts ct ON ct.color = uc.color
            GROUP BY u._id
            ORDER BY u._id DESC
            LIMIT ?
            OFFSET ?
            `,
    ReadAllSummaryWithPages: `
            SELECT 
                u._id AS unit_id,
                u._num AS unit_num,
                u.transform,
                u.lf,
                u.zenkai,
                u.tagswitch,
                GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
                GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
                GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
                GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
                GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts
            FROM unit u
                LEFT JOIN unit_name un ON un.unit = u._id
                LEFT JOIN rarity_texts r ON r.rarity = u.rarity
                LEFT JOIN type_texts t ON t.type = u.type
                LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter
                LEFT JOIN unit_color uc ON uc.unit = u._id
                LEFT JOIN color_texts ct ON ct.color = uc.color
            GROUP BY u._id
            ORDER BY u._id DESC
            LIMIT ?
            OFFSET ?
    `,
    ReadByID: `
                SELECT 
                    u._id AS unit_id,
                    u._num AS unit_num,
                        (SELECT json_group_array(json_object('lang', un.lang, 'id', un.num, 'content', un.content))
                        FROM unit_name un
                        WHERE un.unit = u._id) AS unit_names,
                        (SELECT json_group_array(json_object('id', r.rarity,'lang', r.lang, 'name', r.content))
                        FROM rarity_texts r
                        WHERE r.rarity = u.rarity) AS rarity_texts,
                        (SELECT json_group_array(json_object('id', t.type,'lang', t.lang, 'name', t.content))
                        FROM type_texts t
                        WHERE t.type = u.type) AS type_texts,
                        (SELECT json_group_array(json_object('id', ch.chapter,'lang', ch.lang, 'name', ch.content))
                        FROM chapter_texts ch
                        WHERE ch.chapter = u.chapter) AS chapter_texts,
                        (
                        SELECT json_group_array(
                        json_object('id', c.color, 'number', c.number, 'lang', ct.lang, 'name', ct.content)
                        )
                        FROM unit_color c
                        JOIN color_texts ct ON ct.color = c.color
                        WHERE c.unit = u._id
                        ) AS color_texts,
                    u.transform,
                    u.lf,
                    u.zenkai,
                    u.tagswitch
                FROM unit u
                WHERE u._id = ?
            `,
    ReadByNUM: `
            SELECT 
                u._id AS unit_id,
                u._num AS unit_num,
                    (SELECT json_group_array(json_object('lang', un.lang, 'id', un.num, 'content', un.content))
                    FROM unit_name un
                    WHERE un.unit = u._id) AS unit_names,
                    (SELECT json_group_array(json_object('id', r.rarity,'lang', r.lang, 'name', r.content))
                    FROM rarity_texts r
                    WHERE r.rarity = u.rarity) AS rarity_texts,
                    (SELECT json_group_array(json_object('id', t.type,'lang', t.lang, 'name', t.content))
                    FROM type_texts t
                    WHERE t.type = u.type) AS type_texts,
                    (SELECT json_group_array(json_object('id', ch.chapter,'lang', ch.lang, 'name', ch.content))
                    FROM chapter_texts ch
                    WHERE ch.chapter = u.chapter) AS chapter_texts,
                    (
                    SELECT json_group_array(
                    json_object('id', c.color, 'number', c.number, 'lang', ct.lang, 'name', ct.content)
                    )
                    FROM unit_color c
                    JOIN color_texts ct ON ct.color = c.color
                    WHERE c.unit = u._id
                    ) AS color_texts,
                u.transform,
                u.lf,
                u.zenkai,
                u.tagswitch
            FROM unit u
            WHERE u._num = ?
        `,
    ReadTotal: `
        SELECT 
            COUNT(_id) total
        FROM unit
    `,
    ReadByName: `
        SELECT 
            u._id AS unit_id,
            u._num AS unit_num,
            u.transform,
            u.lf,
            u.zenkai,
            u.tagswitch,
            GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
            GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
            GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
            GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
            GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts
        FROM unit u
            LEFT JOIN unit_name un ON un.unit = u._id
            LEFT JOIN rarity_texts r ON r.rarity = u.rarity
            LEFT JOIN type_texts t ON t.type = u.type
            LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter
            LEFT JOIN unit_color uc ON uc.unit = u._id
            LEFT JOIN color_texts ct ON ct.color = uc.color
        WHERE un.content LIKE '%?%'
        GROUP BY u._id
        ORDER BY u._id DESC
    `
}

/* SELECT ALL WITH PAGES --- GEMINI SUGERENCE

SELECT 
    u._id AS unit_id,
    u._num AS unit_num,
    u.transform,
    u.lf,
    u.zenkai,
    u.tagswitch,
    
    -- Campos que vienen de las subconsultas ya agregadas
    un.unit_names,
    rt.rarity_texts,
    tt.type_texts,
    cht.chapter_texts,
    uct.color_texts
FROM unit u
LEFT JOIN (
    SELECT 
        unit, 
        GROUP_CONCAT(DISTINCT num || '::' || lang || '::' || content) AS unit_names
    FROM unit_name
    GROUP BY unit
) un ON un.unit = u._id
LEFT JOIN (
    SELECT 
        rarity, 
        -- No necesitas u.rarity aquí, solo el valor y el texto
        GROUP_CONCAT(DISTINCT lang || '::' || content) AS rarity_texts
    FROM rarity_texts
    GROUP BY rarity
) rt ON rt.rarity = u.rarity
LEFT JOIN (
    SELECT 
        type, 
        GROUP_CONCAT(DISTINCT lang || '::' || content) AS type_texts
    FROM type_texts
    GROUP BY type
) tt ON tt.type = u.type
LEFT JOIN (
    SELECT 
        chapter, 
        GROUP_CONCAT(DISTINCT lang || '::' || content) AS chapter_texts
    FROM chapter_texts
    GROUP BY chapter
) cht ON cht.chapter = u.chapter
LEFT JOIN (
    SELECT 
        uc.unit, 
        GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts
    FROM unit_color uc
    LEFT JOIN color_texts ct ON ct.color = uc.color
    GROUP BY uc.unit
) uct ON uct.unit = u._id
ORDER BY u._id DESC
LIMIT ?
OFFSET ?
            

*/