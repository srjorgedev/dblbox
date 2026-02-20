import { BASIC_JSON_SELECT as UNIT_SELECT_JSON } from "./unit.query"

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
            'num', condition_num,
            'category', category,
            'value_id', value_id,
            'value', value
        )
    )
    FROM (
        SELECT 
            ec.condition_num,
            'unit' as category,
            ec.unit_id as value_id,
            u._id as value
        FROM equipment_condition ec
        JOIN unit u ON u._id = ec.unit_id
        WHERE ec.equipment_id = e._id
          AND ec.unit_id IS NOT NULL

        UNION ALL

        SELECT 
            ec.condition_num,
            'tag',
            ec.tag_id,
            t.content
        FROM equipment_condition ec
        JOIN tag_texts t ON t.tag = ec.tag_id AND t.lang = ?
        WHERE ec.equipment_id = e._id
          AND ec.tag_id IS NOT NULL

        UNION ALL

        SELECT 
            ec.condition_num,
            'type',
            ec.type_id,
            ty.content
        FROM equipment_condition ec
        JOIN type_texts ty ON ty.type = ec.type_id AND ty.lang = ?
        WHERE ec.equipment_id = e._id
          AND ec.type_id IS NOT NULL

        UNION ALL

        SELECT 
            ec.condition_num,
            'rarity',
            ec.rarity_id,
            r.content
        FROM equipment_condition ec
        JOIN rarity_texts r ON r.rarity = ec.rarity_id AND r.lang = ?
        WHERE ec.equipment_id = e._id
          AND ec.rarity_id IS NOT NULL

        UNION ALL

        SELECT 
            ec.condition_num,
            'color',
            ec.color_id,
            ct.content
        FROM equipment_condition ec
        JOIN color_texts ct ON ct.color = ec.color_id AND ct.lang = ?
        WHERE ec.equipment_id = e._id
          AND ec.color_id IS NOT NULL

        UNION ALL

        SELECT 
            ec.condition_num,
            'chapter',
            ec.chapter_id,
            c.content
        FROM equipment_condition ec
        JOIN chapter_texts c ON c.chapter = ec.chapter_id AND c.lang = ?
        WHERE ec.equipment_id = e._id
          AND ec.chapter_id IS NOT NULL
    )
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
    `,
    byUnit: `
WITH 
valid_equipment AS (
    SELECT DISTINCT e._id
    FROM equipment e
    INNER JOIN equipment_condition ec ON ec.equipment_id = e._id
    CROSS JOIN unit u
    WHERE u._id = ?
    GROUP BY e._id, ec.condition_num
    HAVING COUNT(*) = SUM(
        CASE
            WHEN (ec.unit_id IS NULL OR ec.unit_id = u._id)
            AND (ec.chapter_id IS NULL OR ec.chapter_id = u.chapter)
            AND (ec.type_id IS NULL OR ec.type_id = u.type)
            AND (ec.rarity_id IS NULL OR ec.rarity_id = u.rarity)
            AND (ec.tag_id IS NULL OR EXISTS (
                SELECT 1 FROM unit_tag ut 
                WHERE ut.unit = u._id AND ut.tag = ec.tag_id
            ))
            AND (ec.color_id IS NULL OR EXISTS (
                SELECT 1 FROM unit_color uc 
                WHERE uc.unit = u._id AND uc.color = ec.color_id
            ))
            THEN 1 ELSE 0
        END
    )
)
${BASIC_JSON_SELECT}
FROM equipment e
INNER JOIN valid_equipment ve ON ve._id = e._id
LEFT JOIN equipment_name en ON en.equipment_id = e._id AND en.lang = ?
LEFT JOIN equipment_type_texts ett ON ett.equipment_type = e.type AND ett.lang = ?
GROUP BY e._id
ORDER BY e.type DESC, e._id DESC;
    `,
    findUnitsByEquipmentID: `
WITH valid_units AS (
    SELECT u._id
    FROM unit u
    CROSS JOIN equipment e
    INNER JOIN equipment_condition ec ON ec.equipment_id = e._id
    WHERE e._id = ?
    GROUP BY u._id, ec.condition_num
    HAVING COUNT(*) = SUM(
        CASE
            WHEN (ec.unit_id IS NULL OR ec.unit_id = u._id)
            AND (ec.chapter_id IS NULL OR ec.chapter_id = u.chapter)
            AND (ec.type_id IS NULL OR ec.type_id = u.type)
            AND (ec.rarity_id IS NULL OR ec.rarity_id = u.rarity)
            AND (ec.tag_id IS NULL OR EXISTS (
                SELECT 1 FROM unit_tag ut 
                WHERE ut.unit = u._id AND ut.tag = ec.tag_id
            ))
            AND (ec.color_id IS NULL OR EXISTS (
                SELECT 1 FROM unit_color uc 
                WHERE uc.unit = u._id AND uc.color = ec.color_id
            ))
            THEN 1 ELSE 0
        END
    )
)
SELECT 
${UNIT_SELECT_JSON}
FROM unit u
INNER JOIN valid_units vu ON vu._id = u._id
GROUP BY u._id
ORDER BY u._id DESC;
    `
}

type SortQueriesType = {
    [key: string]: string;
}

export const SortQueries: SortQueriesType = {
    "history": `ORDER BY e._id DESC`,
    "type": `ORDER BY e.type DESC, e._id DESC`
}
