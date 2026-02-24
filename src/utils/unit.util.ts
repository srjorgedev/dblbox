import * as Types from "@/types/unit.types"

export function parseBasic(data: string) {
    return JSON.parse(data);
}

export function groupAbilities(abilities: Types.AbilityJSON): Types.Ability {
    const groupedContent: Record<string, Types.AbilityContent[]> = {};

    for (const ability of abilities.content) {
        const key = String(ability.type.id);
        if (!groupedContent[key]) {
            groupedContent[key] = [];
        }
        groupedContent[key].push(ability);
    }

    return {
        count: abilities.count,
        content: groupedContent
    };
}

export function insertQueryBuilder(table: Types.UnitTables) {
    return `
INSERT INTO ${table}
(${Types.TABLE_COLUMNS[table].join(", ")})
VALUES (${Array(Types.TABLE_COLUMNS[table].length).fill("?").join(", ")});
      `
}

export function updateQueryBuilder<
    T extends keyof Types.TableMap
>(
    table: T,
    data: Partial<Types.TableMap[T]>,
    where: Types.Clauses
) {
    const entries = Object.entries(data)
        .filter(([_, value]) => value !== undefined)

    if (entries.length === 0) {
        throw new Error("No fields to update")
    }

    const setClause = entries
        .map(([key]) => `${key} = ?`)
        .join(", ")

    const values = entries.map(
        ([_, value]) => value as string | number | null
    )

    const sql = `
    UPDATE ${table}
    SET ${setClause}
    ${Types.WHERE_CLAUSES[where]}
  `

    return { sql, values }
}