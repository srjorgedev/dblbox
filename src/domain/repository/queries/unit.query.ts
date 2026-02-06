export const UnitQueries = {
    count: `
        SELECT COUNT(_id) AS Total FROM unit
    `,
    findPages: `
        SELECT 
            u._id AS unit_id,
            u._num AS unit_num,
            u.transform,
            u.lf,
            u.zenkai,
            u.tagswitch,
            u.fusion,
        GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
        GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
        GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
        GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
        GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts,
		GROUP_CONCAT(DISTINCT ut.tag || '::' || tt.lang || '::' || tt.content) AS tag_texts
        FROM unit u
        LEFT JOIN unit_name un ON un.unit = u._id and un.lang = ?
        LEFT JOIN rarity_texts r ON r.rarity = u.rarity and r.lang = ?
        LEFT JOIN type_texts t ON t.type = u.type and t.lang = ?
        LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter and ch.lang = ?
        LEFT JOIN unit_color uc ON uc.unit = u._id
        LEFT JOIN color_texts ct ON ct.color = uc.color and ct.lang = ?
        LEFT JOIN unit_tag ut ON ut.unit = u._id
		LEFT JOIN tag_texts tt ON tt.tag = ut.tag and tt.lang = ?
        GROUP BY u._id
        <order>
        LIMIT ?
        OFFSET ?
    `,
    findAll: `
        SELECT 
            u._id AS unit_id,
            u._num AS unit_num,
            u.transform,
            u.lf,
            u.zenkai,
            u.tagswitch,
            u.fusion,
        GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
        GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
        GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
        GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
        GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts,
		GROUP_CONCAT(DISTINCT ut.tag || '::' || tt.lang || '::' || tt.content) AS tag_texts
        FROM unit u
        LEFT JOIN unit_name un ON un.unit = u._id and un.lang = ?
        LEFT JOIN rarity_texts r ON r.rarity = u.rarity and r.lang = ?
        LEFT JOIN type_texts t ON t.type = u.type and t.lang = ?
        LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter and ch.lang = ?
        LEFT JOIN unit_color uc ON uc.unit = u._id
        LEFT JOIN color_texts ct ON ct.color = uc.color and ct.lang = ?
        LEFT JOIN unit_tag ut ON ut.unit = u._id
		LEFT JOIN tag_texts tt ON tt.tag = ut.tag and tt.lang = ?
        GROUP BY u._id
        <order>
    `,
    findByID: `
        SELECT 
            u._id AS unit_id,
            u._num AS unit_num,
            u.transform,
            u.lf,
            u.zenkai,
            u.tagswitch,
            u.fusion,
        GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
        GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
        GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
        GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
        GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts,
		GROUP_CONCAT(DISTINCT ut.tag || '::' || tt.lang || '::' || tt.content) AS tag_texts
        FROM unit u
        LEFT JOIN unit_name un ON un.unit = u._id AND un.lang = ?
        LEFT JOIN rarity_texts r ON r.rarity = u.rarity AND  r.lang = ?
        LEFT JOIN type_texts t ON t.type = u.type AND  t.lang = ?
        LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter AND ch.lang  = ?
        LEFT JOIN unit_color uc ON uc.unit = u._id
        LEFT JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ?
		LEFT JOIN unit_tag ut ON ut.unit = u._id
		LEFT JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ?
        WHERE u._id = ?
        GROUP BY u._id
        ORDER BY u._id DESC
    `,
    findByNum: `
        SELECT 
            u._id AS unit_id,
            u._num AS unit_num,
            u.transform,
            u.lf,
            u.zenkai,
            u.tagswitch,
            u.fusion,
        GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
        GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
        GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
        GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
        GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts,
		GROUP_CONCAT(DISTINCT ut.tag || '::' || tt.lang || '::' || tt.content) AS tag_texts
        FROM unit u
        LEFT JOIN unit_name un ON un.unit = u._id AND un.lang = ?
        LEFT JOIN rarity_texts r ON r.rarity = u.rarity AND  r.lang = ?
        LEFT JOIN type_texts t ON t.type = u.type AND  t.lang = ?
        LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter AND ch.lang  = ?
        LEFT JOIN unit_color uc ON uc.unit = u._id
        LEFT JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ?
		LEFT JOIN unit_tag ut ON ut.unit = u._id
		LEFT JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ?
        WHERE u._num = ?
        GROUP BY u._id
        ORDER BY u._id DESC
    `,
    findByName: `
        SELECT 
            u._id AS unit_id,
            u._num AS unit_num,
            u.transform,
            u.lf,
            u.zenkai,
            u.tagswitch,
            u.fusion,
        GROUP_CONCAT(DISTINCT un.num || '::' || un.lang || '::' || un.content) AS unit_names,
        GROUP_CONCAT(DISTINCT u.rarity || '::' || r.lang || '::' || r.content) AS rarity_texts,
        GROUP_CONCAT(DISTINCT u.type || '::' || t.lang || '::' || t.content) AS type_texts,
        GROUP_CONCAT(DISTINCT u.chapter || '::' || ch.lang || '::' || ch.content) AS chapter_texts,
        GROUP_CONCAT(DISTINCT uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content) AS color_texts,
		GROUP_CONCAT(DISTINCT ut.tag || '::' || tt.lang || '::' || tt.content) AS tag_texts
        FROM unit u
        LEFT JOIN unit_name un ON un.unit = u._id
        LEFT JOIN rarity_texts r ON r.rarity = u.rarity
        LEFT JOIN type_texts t ON t.type = u.type
        LEFT JOIN chapter_texts ch ON ch.chapter = u.chapter
        LEFT JOIN unit_color uc ON uc.unit = u._id
        LEFT JOIN color_texts ct ON ct.color = uc.color
        LEFT JOIN unit_tag ut ON ut.unit = u._id
		LEFT JOIN tag_texts tt ON tt.tag = ut.tag
        WHERE un.content LIKE '%' || ? || '%'
        GROUP BY u._id
        ORDER BY u._id DESC
    `
}

type OrderQueriesType = {
    [key: string]: string;
}

export const UnitQueriesOrder: OrderQueriesType = {
    "history": `
    ORDER BY u._id DESC
    `,
    "rarity": `
    ORDER BY 
	u.rarity DESC, 
	u.lf DESC, 
	u._id DESC
    `
}