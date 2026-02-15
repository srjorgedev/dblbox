export const RankQueries = {
  GetGroups: `
    SELECT
      rg._id,
      rgt.title,
      rgt.description
    FROM ranking_group rg
    JOIN ranking_group_text rgt
      ON rgt.ranking_group_id = rg._id
    WHERE rgt.lang = ?
    ORDER BY rg._id;
  `,

  UpsertVote: `
    INSERT INTO ranking_vote (
      user_id, ranking_group_id, unit_id,
      date, rank_position,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(user_id, ranking_group_id, unit_id, date)
    DO UPDATE SET
      rank_position = excluded.rank_position,
      updated_at = datetime('now');
  `,

  ComputeRankingRows: `
    WITH window_votes AS (
      SELECT *
      FROM ranking_vote
      WHERE ranking_group_id = ?
        AND date >= date(?, '-' || (? - 1) || ' days')
        AND date <= date(?)
    ),
    latest_per_user_unit AS (
      SELECT
        user_id,
        ranking_group_id,
        unit_id,
        MAX(date) AS latest_date
      FROM window_votes
      GROUP BY user_id, ranking_group_id, unit_id
    ),
    effective_votes AS (
      SELECT v.*
      FROM window_votes v
      JOIN latest_per_user_unit l
        ON l.user_id = v.user_id
       AND l.ranking_group_id = v.ranking_group_id
       AND l.unit_id = v.unit_id
       AND l.latest_date = v.date
    )
    SELECT
      unit_id,
      AVG(rank_position) AS avg_rank,
      COUNT(*) AS votes_count
    FROM effective_votes
    GROUP BY unit_id
    ORDER BY avg_rank ASC, votes_count DESC;
  `,

  DeleteSnapshotItems: `
    DELETE FROM ranking_daily_snapshot_item
    WHERE ranking_group_id = ? AND date = ?;
  `,

  DeleteSnapshotHeader: `
    DELETE FROM ranking_daily_snapshot
    WHERE ranking_group_id = ? AND date = ?;
  `,

  InsertSnapshotHeader: `
    INSERT INTO ranking_daily_snapshot (ranking_group_id, date, window_days)
    VALUES (?, ?, ?);
  `,

  InsertSnapshotItem: `
    INSERT INTO ranking_daily_snapshot_item (
      ranking_group_id, date, unit_id,
      score, avg_rank, votes_count,
      position
    )
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `,

  GetBestSnapshotDate: `
    SELECT s.date
    FROM ranking_daily_snapshot s
    WHERE s.ranking_group_id = ?
      AND s.date <= ?
      AND EXISTS (
        SELECT 1
        FROM ranking_daily_snapshot_item i
        WHERE i.ranking_group_id = s.ranking_group_id
          AND i.date = s.date
      )
    ORDER BY s.date DESC
    LIMIT 1;
  `,

  GetSnapshotItems: `
    SELECT
      position,
      unit_id,
      score,
      avg_rank,
      votes_count
    FROM ranking_daily_snapshot_item
    WHERE ranking_group_id = ? AND date = ?
    ORDER BY position ASC;
  `,

  GetUnitRankFromSnapshot: `
    SELECT
      position,
      score,
      avg_rank,
      votes_count
    FROM ranking_daily_snapshot_item
    WHERE ranking_group_id = ?
      AND date = ?
      AND unit_id = ?
    LIMIT 1;
  `,

  GetLastVoteForUserUnit: `
    SELECT
      user_id,
      ranking_group_id,
      unit_id,
      date,
      rank_position,
      updated_at
    FROM ranking_vote
    WHERE user_id = ?
      AND ranking_group_id = ?
      AND unit_id = ?
    ORDER BY date DESC, updated_at DESC
    LIMIT 1;
  `,

  GetLastVoteForUser: `
    SELECT
      user_id,
      ranking_group_id,
      unit_id,
      date,
      rank_position,
      updated_at
    FROM ranking_vote
    WHERE user_id = ?
    ORDER BY date DESC, updated_at DESC
    LIMIT 1;
  `,

  GetLastVoteForUserInGroup: `
    SELECT
      user_id,
      ranking_group_id,
      unit_id,
      date,
      rank_position,
      updated_at
    FROM ranking_vote
    WHERE user_id = ?
      AND ranking_group_id = ?
    ORDER BY date DESC, updated_at DESC
    LIMIT 1;
  `,

  GetVoteDistributionForUnits: `
    WITH window_votes AS (
      SELECT *
      FROM ranking_vote
      WHERE ranking_group_id = ?
        AND date >= ? AND date <= ?
        AND unit_id IN (<unit_ids>)
    ),
    latest_per_user_unit AS (
      SELECT
        user_id,
        ranking_group_id,
        unit_id,
        MAX(date) AS latest_date
      FROM window_votes
      GROUP BY user_id, ranking_group_id, unit_id
    ),
    effective_votes AS (
      SELECT v.unit_id, v.rank_position
      FROM window_votes v
      JOIN latest_per_user_unit l
        ON l.user_id = v.user_id
       AND l.ranking_group_id = v.ranking_group_id
       AND l.unit_id = v.unit_id
       AND l.latest_date = v.date
    )
    SELECT
      unit_id,
      GROUP_CONCAT(rank_position) AS vote_positions
    FROM effective_votes
    GROUP BY unit_id;
  `,

  GetSnapshotWindow: `
    SELECT window_days
    FROM ranking_daily_snapshot
    WHERE ranking_group_id = ? AND date = ?
    LIMIT 1;
  `,

  ComputeLiveTopRankingRows: `
    WITH window_votes AS (
      SELECT *
      FROM ranking_vote
      WHERE ranking_group_id = ?
        AND date >= date(?, '-' || (? - 1) || ' days')
        AND date <= date(?)
    ),
    latest_per_user_unit AS (
      SELECT
        user_id,
        ranking_group_id,
        unit_id,
        MAX(date) AS latest_date
      FROM window_votes
      GROUP BY user_id, ranking_group_id, unit_id
    ),
    effective_votes AS (
      SELECT v.*
      FROM window_votes v
      JOIN latest_per_user_unit l
        ON l.user_id = v.user_id
       AND l.ranking_group_id = v.ranking_group_id
       AND l.unit_id = v.unit_id
       AND l.latest_date = v.date
    ),
    ranked AS (
      SELECT
        unit_id,
        AVG(rank_position) AS avg_rank,
        COUNT(*) AS votes_count
      FROM effective_votes
      GROUP BY unit_id
    )
    SELECT
      unit_id,
      avg_rank,
      votes_count
    FROM ranked
    ORDER BY avg_rank ASC, votes_count DESC
    LIMIT ?;
  `,

  ComputeLiveUnitRankRow: `
    WITH window_votes AS (
      SELECT *
      FROM ranking_vote
      WHERE ranking_group_id = ?
        AND date >= date(?, '-' || (? - 1) || ' days')
        AND date <= date(?)
    ),
    latest_per_user_unit AS (
      SELECT
        user_id,
        ranking_group_id,
        unit_id,
        MAX(date) AS latest_date
      FROM window_votes
      GROUP BY user_id, ranking_group_id, unit_id
    ),
    effective_votes AS (
      SELECT v.*
      FROM window_votes v
      JOIN latest_per_user_unit l
        ON l.user_id = v.user_id
       AND l.ranking_group_id = v.ranking_group_id
       AND l.unit_id = v.unit_id
       AND l.latest_date = v.date
    ),
    ranked AS (
      SELECT
        unit_id,
        AVG(rank_position) AS avg_rank,
        COUNT(*) AS votes_count
      FROM effective_votes
      GROUP BY unit_id
    ),
    ranked_with_positions AS (
      SELECT
        unit_id,
        avg_rank,
        votes_count,
        ROW_NUMBER() OVER (ORDER BY avg_rank ASC, votes_count DESC) AS position
      FROM ranked
    )
    SELECT
      unit_id,
      avg_rank,
      votes_count,
      position
    FROM ranked_with_positions
    WHERE unit_id = ?
    LIMIT 1;
  `
};
