// v1/queries/rank.query.ts

const GROUP_JSON = `
json_object(
    '_id', rg._id,
    'type', rg.type,
    'is_active', iif(rg.is_active = 1, json('true'), json('false')),
    'title', rgt.title,
    'description', rgt.description
) data
`;  // ← SIEMPRE "as data" al final

const REALTIME_JSON = `
json_object(
    'position', r.current_position,
    'unit_id', r.unit_id,
    'score', r.score,
    'avg_rank', round(r.avg_rank, 2),
    'votes', r.votes_count,
    'trend', r.trending_direction,
    'hourly_votes', r.hourly_votes,
    'last_vote', r.last_vote_at,
    'unit_name', (
        SELECT un.content 
        FROM unit_name un 
        WHERE un.unit = r.unit_id AND un.lang = ? 
        LIMIT 1
    )
) data
`;

const SNAPSHOT_JSON = `
json_object(
    'date', s.date,
    'generated_at', s.generated_at,
    'window_days', s.window_days,
    'total_votes', s.total_votes,
    'total_units', s.total_units
) data
`;

const SNAPSHOT_ITEM_JSON = `
json_object(
    'position', i.position,
    'unit_id', i.unit_id,
    'score', i.score,
    'avg_rank', round(i.avg_rank, 2),
    'votes', i.votes_count,
    'change', i.position_change,
    'unit_name', (
        SELECT un.content 
        FROM unit_name un 
        WHERE un.unit = i.unit_id AND un.lang = ? 
        LIMIT 1
    )
) data
`;

const VOTE_JSON = `
json_object(
    'user_id', user_id,
    'group_id', ranking_group_id,
    'unit_id', unit_id,
    'position', rank_position,
    'date', date,
    'created_at', created_at
) data
`;

export const RankQueries = {
  // ==========================================
  // GRUPOS
  // ==========================================

  getGroups: `
        SELECT ${GROUP_JSON}
        FROM ranking_group rg
        LEFT JOIN ranking_group_text rgt 
            ON rgt.ranking_group_id = rg._id 
            AND rgt.lang = ?
        WHERE rg.is_active = 1
        ORDER BY rg._id;
    `,

  getGroupByID: `
        SELECT 
            json_object(
                '_id', rg._id,
                'type', rg.type,
                'is_active', iif(rg.is_active = 1, json('true'), json('false')),
                'config', json(rg.config),
                'texts', (
                    SELECT json_group_array(
                        json_object(
                            'lang', rgt.lang,
                            'title', rgt.title,
                            'description', rgt.description
                        )
                    )
                    FROM ranking_group_text rgt
                    WHERE rgt.ranking_group_id = rg._id
                )
            ) data
        FROM ranking_group rg
        WHERE rg._id = ?;
    `,

  // ==========================================
  // VOTOS
  // ==========================================

  insertVote: `
        INSERT INTO ranking_vote (
            user_id, ranking_group_id, unit_id, date, rank_position
        ) VALUES (?, ?, ?, date('now'), ?)
        RETURNING ${VOTE_JSON};
    `,

  updateVote: `
        UPDATE ranking_vote 
        SET rank_position = ?, updated_at = datetime('now')
        WHERE user_id = ? AND ranking_group_id = ? 
            AND unit_id = ? AND date = date('now')
        RETURNING ${VOTE_JSON};
    `,

  getUserVoteToday: `
        SELECT ${VOTE_JSON}
        FROM ranking_vote
        WHERE user_id = ? AND ranking_group_id = ? 
            AND unit_id = ? AND date = date('now');
    `,

  getUserVotes: `
        SELECT ${VOTE_JSON}
        FROM ranking_vote
        WHERE user_id = ? AND ranking_group_id = ?
        ORDER BY date DESC, updated_at DESC
        LIMIT ? OFFSET ?;
    `,

  // ==========================================
  // TIEMPO REAL
  // ==========================================

  getRealtimeRanking: `
        SELECT ${REALTIME_JSON}
        FROM ranking_realtime r
        WHERE r.ranking_group_id = ? AND r.current_position IS NOT NULL
        ORDER BY r.current_position
        LIMIT ? OFFSET ?;
    `,

  getUnitRealtime: `
        SELECT ${REALTIME_JSON}
        FROM ranking_realtime r
        WHERE r.ranking_group_id = ? AND r.unit_id = ?;
    `,

  getTrendingUnits: `
        SELECT ${REALTIME_JSON}
        FROM ranking_realtime r
        WHERE r.ranking_group_id = ? 
            AND r.hourly_votes > 0
            AND datetime(r.last_vote_at) > datetime('now', '-3 hours')
        ORDER BY (r.hourly_votes * (100 - r.current_position + 1)) DESC
        LIMIT ?;
    `,

  // ==========================================
  // SNAPSHOTS
  // ==========================================

  getSnapshotByDate: `
        SELECT ${SNAPSHOT_ITEM_JSON}
        FROM ranking_daily_snapshot_item i
        WHERE i.ranking_group_id = ? AND i.date = ?
        ORDER BY i.position;
    `,

  getLatestSnapshot: `
        SELECT ${SNAPSHOT_ITEM_JSON}
        FROM ranking_daily_snapshot_item i
        WHERE i.ranking_group_id = ? 
            AND i.date = (
                SELECT MAX(date) 
                FROM ranking_daily_snapshot 
                WHERE ranking_group_id = ?
            )
        ORDER BY i.position;
    `,

  getUnitHistory: `
        SELECT 
            json_object(
                'date', i.date,
                'position', i.position,
                'score', i.score,
                'avg_rank', round(i.avg_rank, 2),
                'votes', i.votes_count,
                'change', i.position_change
            ) data
        FROM ranking_daily_snapshot_item i
        WHERE i.ranking_group_id = ? AND i.unit_id = ?
        ORDER BY i.date DESC
        LIMIT ?;
    `,

  // ==========================================
  // INSERTS (para admin)
  // ==========================================

  generateSnapshot: `
        INSERT INTO ranking_daily_snapshot (
            ranking_group_id, date, window_days, total_votes, total_units
        )
        SELECT 
            ?,
            date('now'),
            ?,
            COALESCE(SUM(r.votes_count), 0),
            COUNT(*)
        FROM ranking_realtime r
        WHERE r.ranking_group_id = ?
        RETURNING 
            json_object(
                'group_id', ranking_group_id,
                'date', date,
                'generated_at', generated_at,
                'total_votes', total_votes,
                'total_units', total_units
            ) data;
    `,

  generateSnapshotItems: `
        INSERT INTO ranking_daily_snapshot_item (
            ranking_group_id, date, unit_id, score, avg_rank, 
            votes_count, position, previous_position
        )
        SELECT 
            ?,
            date('now'),
            r.unit_id,
            r.score,
            r.avg_rank,
            r.votes_count,
            r.current_position,
            (
                SELECT i.position 
                FROM ranking_daily_snapshot_item i
                WHERE i.ranking_group_id = r.ranking_group_id 
                    AND i.unit_id = r.unit_id
                ORDER BY i.date DESC 
                LIMIT 1
            )
        FROM ranking_realtime r
        WHERE r.ranking_group_id = ? AND r.current_position <= 100
        RETURNING ${SNAPSHOT_ITEM_JSON};
    `,

  // ==========================================
  // UTILS
  // ==========================================

  recalculatePositions: `
        UPDATE ranking_realtime 
        SET current_position = (
            SELECT COUNT(*) + 1
            FROM ranking_realtime r2
            WHERE r2.ranking_group_id = ranking_realtime.ranking_group_id
                AND (r2.score > ranking_realtime.score OR 
                    (r2.score = ranking_realtime.score AND r2.unit_id < ranking_realtime.unit_id))
        );
    `
};

export const SortQueries: Record<string, string> = {
  "position": `ORDER BY r.current_position ASC`,
  "score": `ORDER BY r.score DESC`,
  "votes": `ORDER BY r.votes_count DESC`,
  "trending": `ORDER BY r.hourly_votes DESC, r.current_position ASC`,
  "recent": `ORDER BY r.last_vote_at DESC NULLS LAST`
};