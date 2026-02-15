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
            COalesce('color'   || '::' || ec.color_id  || '::' || ct.content, ''),
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
  findAllByUnitID: `
WITH
    valid_sets AS (
        SELECT
            ec.equipment_id AS equipment_id,
            ec.condition_num AS condition_num,
            e.type as _type,
            CONCAT (
                ett.equipment_type || '::' || ett.lang || '::' || ett.content
            ) as type,
            e.is_awaken,
            e.is_top,
            e._from
        FROM
            equipment_condition ec
            JOIN unit u ON u._id = ?
            LEFT JOIN equipment e ON ec.equipment_id = e._id
            LEFT JOIN equipment_type_texts ett ON e.type = ett.equipment_type
            AND ett.lang = ?
        GROUP BY
            ec.equipment_id,
            ec.condition_num
        HAVING
            COUNT(*) = SUM(
                CASE
                    WHEN (
                        ec.unit_id IS NULL
                        OR ec.unit_id = u._id
                    )
                    AND (
                        ec.chapter_id IS NULL
                        OR ec.chapter_id = u.chapter
                    )
                    AND (
                        ec.type_id IS NULL
                        OR ec.type_id = u.type
                    )
                    AND (
                        ec.rarity_id IS NULL
                        OR ec.rarity_id = u.rarity
                    )
                    AND (
                        ec.tag_id IS NULL
                        OR EXISTS (
                            SELECT
                                1
                            FROM
                                unit_tag ut
                            WHERE
                                ut.unit = u._id
                                AND ut.tag = ec.tag_id
                        )
                    )
                    AND (
                        ec.color_id IS NULL
                        OR EXISTS (
                            SELECT
                                1
                            FROM
                                unit_color uc
                            WHERE
                                uc.unit = u._id
                                AND uc.color = ec.color_id
                        )
                    ) THEN 1
                    ELSE 0
                END
            )
    )
SELECT DISTINCT
    equipment_id,
    condition_num,
    type,
    is_awaken,
    is_top,
    _from
FROM
    valid_sets
ORDER BY
    _type DESC,
    equipment_id DESC;
    `,
  findUnitsByEquipID: `
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
    WHERE EXISTS (
      SELECT 1
      FROM equipment_condition ec
      WHERE ec.equipment_id = ?
      GROUP BY ec.condition_num
      HAVING
          SUM(
            CASE
              WHEN
                (ec.unit_id IS NULL OR ec.unit_id = u._id)
                AND
                (ec.chapter_id IS NULL OR ec.chapter_id = u.chapter)
                AND
                (ec.type_id IS NULL OR ec.type_id = u.type)
                AND
                (ec.rarity_id IS NULL OR ec.rarity_id = u.rarity)
                AND
                (
                  ec.tag_id IS NULL
                  OR EXISTS (
                    SELECT 1
                    FROM unit_tag ut
                    WHERE ut.unit = u._id
                      AND ut.tag = ec.tag_id
                  )
                )
                AND
                (
                  ec.color_id IS NULL
                  OR EXISTS (
                    SELECT 1
                    FROM unit_color uc
                    WHERE uc.unit = u._id
                      AND uc.color = ec.color_id
                  )
                )
              THEN 1 ELSE 0
            END
          ) = COUNT(*)
        )
	  GROUP BY u._id;
`
}