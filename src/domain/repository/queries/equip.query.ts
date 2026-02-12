export const EquipQueries = {
    findAll: `
    SELECT 
        _id, CONCAT(ett.equipment_type || '::' || ett.lang || '::' || ett.content) as type, is_awaken, is_top, _from
    FROM equipment e
    LEFT JOIN equipment_type_texts ett ON ett.equipment_type = e.type AND ett.lang = ?
	GROUP BY e._id
    `,
    findByID: `
    SELECT 
        e._id, 
        CONCAT(ett.equipment_type || '::' || ett.lang || '::' || ett.content) as type,
        e.is_awaken, 
        e.is_top,
    GROUP_CONCAT(
        ec.condition_num || '::::' || 
        TRIM(
            COALESCE('unit'    || '::' || ec.unit_id   || '::' || u._num || ',', '') ||
            COALESCE('tag'     || '::' || ec.tag_id    || '::' || t.content || '::' || t.lang || ',', '') ||
            COALESCE('type'    || '::' || ec.type_id   || '::' || ty.content || ',', '') ||
            COALESCE('rarity'  || '::' || ec.rarity_id || '::' || r.content || ',', '') ||
            COALESCE('chapter' || '::' || ec.chapter_id || '::' || c.content || ',', '') ||
            COALESCE('color'   || '::' || ec.color_id  || '::' || ct.content, ''),
            ','
        ),
        ' | '
    ) AS conditions_list
    FROM equipment e
    LEFT JOIN equipment_type_texts ett ON ett.equipment_type = e.type AND ett.lang = ?
    LEFT JOIN equipment_condition ec ON e._id = ec.equipment_id
    LEFT JOIN unit u ON u._id = ec.unit_id
    LEFT JOIN tag_texts t ON t.tag = ec.tag_id AND t.lang = ?
    LEFT JOIN type_texts ty ON ty.type = ec.type_id AND ty.lang = ?
    LEFT JOIN rarity_texts r ON r.rarity = ec.rarity_id AND r.lang = ?
    LEFT JOIN chapter_texts c ON c.chapter = ec.chapter_id AND c.lang = ?
    LEFT JOIN color_texts ct ON ct.color = ec.color_id AND ct.lang = ?
    WHERE e._id = ?
    GROUP BY e._id
    `,
    
}