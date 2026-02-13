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
            (SELECT GROUP_CONCAT(un.num || '::' || un.lang || '::' || un.content, '|||' ORDER BY un.num) FROM unit_name un WHERE un.unit = u._id AND un.lang = ?) AS unit_names,
            (SELECT r.rarity || '::' || r.lang || '::' || r.content FROM rarity_texts r WHERE r.rarity = u.rarity AND r.lang = ?) AS rarity_texts,
            (SELECT t.type || '::' || t.lang || '::' || t.content FROM type_texts t WHERE t.type = u.type AND t.lang = ?) AS type_texts,
            (SELECT ch.chapter || '::' || ch.lang || '::' || ch.content FROM chapter_texts ch WHERE ch.chapter = u.chapter AND ch.lang = ?) AS chapter_texts,
            (SELECT GROUP_CONCAT(uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content, '|||' ORDER BY uc.number) FROM unit_color uc JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ? WHERE uc.unit = u._id) AS color_texts,
            (SELECT GROUP_CONCAT(ut.tag || '::' || tt.lang || '::' || tt.content, '|||' ORDER BY ut.tag) FROM unit_tag ut JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ? WHERE ut.unit = u._id) AS tag_texts
        FROM unit u
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
            (SELECT GROUP_CONCAT(un.num || '::' || un.lang || '::' || un.content, '|||' ORDER BY un.num) FROM unit_name un WHERE un.unit = u._id AND un.lang = ?) AS unit_names,
            (SELECT r.rarity || '::' || r.lang || '::' || r.content FROM rarity_texts r WHERE r.rarity = u.rarity AND r.lang = ?) AS rarity_texts,
            (SELECT t.type || '::' || t.lang || '::' || t.content FROM type_texts t WHERE t.type = u.type AND t.lang = ?) AS type_texts,
            (SELECT ch.chapter || '::' || ch.lang || '::' || ch.content FROM chapter_texts ch WHERE ch.chapter = u.chapter AND ch.lang = ?) AS chapter_texts,
            (SELECT GROUP_CONCAT(uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content, '|||' ORDER BY uc.number) FROM unit_color uc JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ? WHERE uc.unit = u._id) AS color_texts,
            (SELECT GROUP_CONCAT(ut.tag || '::' || tt.lang || '::' || tt.content, '|||' ORDER BY ut.tag) FROM unit_tag ut JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ? WHERE ut.unit = u._id) AS tag_texts
        FROM unit u
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
            (SELECT GROUP_CONCAT(un.num || '::' || un.lang || '::' || un.content, '|||' ORDER BY un.num) FROM unit_name un WHERE un.unit = u._id AND un.lang = ?) AS unit_names,
            (SELECT r.rarity || '::' || r.lang || '::' || r.content FROM rarity_texts r WHERE r.rarity = u.rarity AND r.lang = ?) AS rarity_texts,
            (SELECT t.type || '::' || t.lang || '::' || t.content FROM type_texts t WHERE t.type = u.type AND t.lang = ?) AS type_texts,
            (SELECT ch.chapter || '::' || ch.lang || '::' || ch.content FROM chapter_texts ch WHERE ch.chapter = u.chapter AND ch.lang = ?) AS chapter_texts,
            (SELECT GROUP_CONCAT(uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content, '|||' ORDER BY uc.number) FROM unit_color uc JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ? WHERE uc.unit = u._id) AS color_texts,
            (SELECT GROUP_CONCAT(ut.tag || '::' || tt.lang || '::' || tt.content, '|||' ORDER BY ut.tag) FROM unit_tag ut JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ? WHERE ut.unit = u._id) AS tag_texts,
            (SELECT GROUP_CONCAT(a.number || '::' || a.zenkai || '::' || a.title || '::' || a.content || '::' || a.ability_type || '::' || att.content, '|||' ORDER BY a.number) FROM ability a JOIN ability_type_texts att ON att.ability_type = a.ability_type AND att.lang = ? WHERE a.unit = u._id AND a.lang = ?) AS ability_texts
        FROM unit u
        WHERE u._id = ?
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
            (SELECT GROUP_CONCAT(un.num || '::' || un.lang || '::' || un.content, '|||' ORDER BY un.num) FROM unit_name un WHERE un.unit = u._id AND un.lang = ?) AS unit_names,
            (SELECT r.rarity || '::' || r.lang || '::' || r.content FROM rarity_texts r WHERE r.rarity = u.rarity AND r.lang = ?) AS rarity_texts,
            (SELECT t.type || '::' || t.lang || '::' || t.content FROM type_texts t WHERE t.type = u.type AND t.lang = ?) AS type_texts,
            (SELECT ch.chapter || '::' || ch.lang || '::' || ch.content FROM chapter_texts ch WHERE ch.chapter = u.chapter AND ch.lang = ?) AS chapter_texts,
            (SELECT GROUP_CONCAT(uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content, '|||' ORDER BY uc.number) FROM unit_color uc JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ? WHERE uc.unit = u._id) AS color_texts,
            (SELECT GROUP_CONCAT(ut.tag || '::' || tt.lang || '::' || tt.content, '|||' ORDER BY ut.tag) FROM unit_tag ut JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ? WHERE ut.unit = u._id) AS tag_texts,
            (SELECT GROUP_CONCAT(a.number || '::' || a.zenkai || '::' || a.title || '::' || a.content || '::' || a.ability_type || '::' || att.content, '|||' ORDER BY a.number) FROM ability a JOIN ability_type_texts att ON att.ability_type = a.ability_type AND att.lang = ? WHERE a.unit = u._id AND a.lang = ?) AS ability_texts
        FROM unit u
        WHERE u._num = ?
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
            (SELECT GROUP_CONCAT(un.num || '::' || un.lang || '::' || un.content, '|||' ORDER BY un.num) FROM unit_name un WHERE un.unit = u._id AND un.lang = ?) AS unit_names,
            (SELECT r.rarity || '::' || r.lang || '::' || r.content FROM rarity_texts r WHERE r.rarity = u.rarity AND r.lang = ?) AS rarity_texts,
            (SELECT t.type || '::' || t.lang || '::' || t.content FROM type_texts t WHERE t.type = u.type AND t.lang = ?) AS type_texts,
            (SELECT ch.chapter || '::' || ch.lang || '::' || ch.content FROM chapter_texts ch WHERE ch.chapter = u.chapter AND ch.lang = ?) AS chapter_texts,
            (SELECT GROUP_CONCAT(uc.color || '::' || uc.number || '::' || ct.lang || '::' || ct.content, '|||' ORDER BY uc.number) FROM unit_color uc JOIN color_texts ct ON ct.color = uc.color AND ct.lang = ? WHERE uc.unit = u._id) AS color_texts,
            (SELECT GROUP_CONCAT(ut.tag || '::' || tt.lang || '::' || tt.content, '|||' ORDER BY ut.tag) FROM unit_tag ut JOIN tag_texts tt ON tt.tag = ut.tag AND tt.lang = ? WHERE ut.unit = u._id) AS tag_texts
        FROM unit u
        JOIN unit_name un ON un.unit = u._id
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
