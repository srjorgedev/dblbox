const BASIC_JSON_SELECT = `
  json_object(
    '_id', u._id,
    'num', u._num,
    'transform', iif(u.transform = 1, json('true'), json('false')),
    'lf', iif(u.lf = 1, json('true'), json('false')),
    'zenkai', iif(u.zenkai = 1, json('true'), json('false')),
    'tagswitch', iif(u.tagswitch = 1, json('true'), json('false')),
    'fusion', iif(u.fusion = 1, json('true'), json('false')),
    'states', 1
      + iif(u.transform = 1, 1, 0)
      + iif(u.tagswitch = 1, 1, 0)
      + iif(u.fusion = 1, 1, 0),

    'name', (
      SELECT json_object(
        'count', COUNT(*),
        'content', COALESCE(json_group_array(x.content), json('[]'))
      )
      FROM (
        SELECT un.content
        FROM unit_name un
        WHERE un.unit = u._id
          AND un.lang = ?
        ORDER BY un.num
      ) x
    ),

    'rarity', (
      SELECT json_object('id', r.rarity, 'name', r.content)
      FROM rarity_texts r
      WHERE r.rarity = u.rarity
        AND r.lang = ?
    ),

    'chapter', (
      SELECT json_object('id', ch.chapter, 'name', ch.content)
      FROM chapter_texts ch
      WHERE ch.chapter = u.chapter
        AND ch.lang = ?
    ),

    'type', (
      SELECT json_object('id', t.type, 'name', t.content)
      FROM type_texts t
      WHERE t.type = u.type
        AND t.lang = ?
    ),

    'color', (
      SELECT json_object(
        'count', COUNT(*),
        'content', COALESCE(
          json_group_array(
            json_object('id', x.color, 'name', x.name)
          ),
          json('[]')
        )
      )
      FROM (
        SELECT uc.color, ct.content AS name
        FROM unit_color uc
        JOIN color_texts ct
          ON ct.color = uc.color
         AND ct.lang = ?
        WHERE uc.unit = u._id
        ORDER BY uc.number
      ) x
    ),

    'tags', (
      SELECT json_object(
        'count', COUNT(*),
        'content', COALESCE(
          json_group_array(
            json_object('id', x.tag, 'name', x.name)
          ),
          json('[]')
        )
      )
      FROM (
        SELECT ut.tag, tt.content AS name
        FROM unit_tag ut
        JOIN tag_texts tt
          ON tt.tag = ut.tag
         AND tt.lang = ?
        WHERE ut.unit = u._id
        ORDER BY ut.tag
      ) x
    )
  ) AS basic_json
`;

const ABILITIES_JSON_SELECT = (isZenkai: number) => `
  COALESCE(
    (
      SELECT json_object(
        'count', COUNT(*),
        'content', COALESCE(
          json_group_array(
            json_object(
              'number', a.number,
              'zenkai', iif(a.zenkai = 1, json('true'), json('false')),
              'title', a.title,
              'content', a.content,
              'type', json_object(
                'id', a.ability_type,
                'name', COALESCE(att.content, '')
              )
            )
          ),
          json('[]')
        )
      )
      FROM ability a
      LEFT JOIN ability_type_texts att
        ON att.ability_type = a.ability_type
       AND att.lang = ?
      WHERE a.unit = u._id
        AND a.lang = ?
        AND a.zenkai = ${isZenkai}
    ),
    json_object('count', 0, 'content', json('[]'))
  )
`;

export const UnitQueries = {
  count: `
        SELECT COUNT(_id) AS Total FROM unit
    `,

  findPages: `
        SELECT ${BASIC_JSON_SELECT}
        FROM unit u
        <order>
        LIMIT ?
        OFFSET ?
    `,

  findAll: `
        SELECT ${BASIC_JSON_SELECT}
        FROM unit u
        <order>
    `,

  findByID: `
    SELECT
      ${BASIC_JSON_SELECT},
      ${ABILITIES_JSON_SELECT(0)} AS abilities_json,
      ${ABILITIES_JSON_SELECT(1)} AS zenkai_abilities_json
    FROM unit u
    WHERE u._id = ?;
    `,

  findByNum: `
    SELECT
      ${BASIC_JSON_SELECT},
      ${ABILITIES_JSON_SELECT(0)} AS abilities_json,
      ${ABILITIES_JSON_SELECT(1)} AS zenkai_abilities_json
    FROM unit u
    WHERE u._num = ?;
    `,

  findByName: `
        SELECT ${BASIC_JSON_SELECT}
        FROM unit u
        WHERE EXISTS (
            SELECT 1 FROM unit_name un 
            WHERE un.unit = u._id 
            AND un.lang = ? 
            AND un.content LIKE '%' || ? || '%'
        )
        <order>
    `
};

type SortQueriesType = {
  [key: string]: string;
}

export const SortQueries: SortQueriesType = {
  "history": `
    ORDER BY u._id DESC
    `,
  "rarity": `
    ORDER BY 
	    u.rarity DESC, 
	    u.lf DESC, 
	    u._id DESC
    `
};
