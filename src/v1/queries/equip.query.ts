const BASIC_JSON_SELECT = `
SELECT JSON_OBJECT(
    'id', e._id,
    'name', en.content,
    'type', JSON_OBJECT(
		'id', e.type,
		'content', ett.content
	),
    'is_awaken', iif(e.is_awaken = 1, json('true'), json('false')),
    'is_top', iif(e.is_top = 1, json('true'), json('false')),
    'from', e._from
) as equipment_json
`

const CONDITION_JSON_SELECT = `
(
    SELECT JSON_GROUP_ARRAY(
        JSON_OBJECT(
            'num', ec.condition_num,
            'category', CASE 
                WHEN ec.unit_id IS NOT NULL THEN 'unit'
                WHEN ec.tag_id IS NOT NULL THEN 'tag'
                WHEN ec.type_id IS NOT NULL THEN 'type'
                WHEN ec.rarity_id IS NOT NULL THEN 'rarity'
                WHEN ec.color_id IS NOT NULL THEN 'color'
                WHEN ec.chapter_id IS NOT NULL THEN 'chapter'
            END,
            'value_id', COALESCE(ec.unit_id, ec.tag_id, ec.type_id, ec.rarity_id, ec.color_id, ec.chapter_id),
            'value', COALESCE(u._id, t.content, ty.content, r.content, ct.content, c.content)
        )
    )
    FROM equipment_condition ec
    LEFT JOIN unit u ON u._id = ec.unit_id
    LEFT JOIN tag_texts t ON t.tag = ec.tag_id AND t.lang = ?
    LEFT JOIN type_texts ty ON ty.type = ec.type_id AND ty.lang = ?
    LEFT JOIN rarity_texts r ON r.rarity = ec.rarity_id AND r.lang = ?
    LEFT JOIN color_texts ct ON ct.color = ec.color_id AND ct.lang = ?
    LEFT JOIN chapter_texts c ON c.chapter = ec.chapter_id AND c.lang = ?
    WHERE ec.equipment_id = e._id
) AS conditions_list
`

const EFFECTS_JSON_SELECT = `
(
    SELECT JSON_GROUP_ARRAY(
        JSON_OBJECT(
            'slot', ee.slot_num,
            'slot_type', ee.slot_type,
            'group', ee.group_num,
            'order', ee.effect_num,
            'description', ee.slot_effect
        )
    )
    FROM (
        SELECT * FROM equipment_effect 
        WHERE equipment_id = e._id AND lang = ?
        ORDER BY slot_num ASC, group_num ASC, effect_num ASC
    ) ee
) AS effects_list
 `

export const EquipQueries = {
    count: `SELECT COUNT(_id) as Total FROM equipment;`,
    findPages: `
        ${BASIC_JSON_SELECT}
        FROM equipment e
        LEFT JOIN equipment_name en ON en.equipment_id = e._id AND en.lang = ?
        LEFT JOIN equipment_type_texts ett ON ett.equipment_type = e.type AND ett.lang = ?
        GROUP BY e._id
        <order> 
        LIMIT ? OFFSET ?;
    `,
    findAll: `
        ${BASIC_JSON_SELECT}
        FROM equipment e
        LEFT JOIN equipment_name en ON en.equipment_id = e._id AND en.lang = ?
        LEFT JOIN equipment_type_texts ett ON ett.equipment_type = e.type AND ett.lang = ?
        GROUP BY e._id
        <order>;
    `,
    findByID: `
        ${BASIC_JSON_SELECT},
        ${CONDITION_JSON_SELECT},
        ${EFFECTS_JSON_SELECT}
        FROM equipment e
        LEFT JOIN equipment_name en ON en.equipment_id = e._id AND en.lang = ?
        LEFT JOIN equipment_type_texts ett ON ett.equipment_type = e.type AND ett.lang = ?
        WHERE e._id = ?
        GROUP BY e._id;
    `
}

type SortQueriesType = {
    [key: string]: string;
}

export const SortQueries: SortQueriesType = {
    "history": `ORDER BY e._id DESC`,
    "type": `ORDER BY e.type DESC, e._id DESC`
}
