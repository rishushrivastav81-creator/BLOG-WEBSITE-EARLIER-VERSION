import { sampleSqlTables } from '../data/practiceData';

export interface SqlQueryResult {
  success: boolean;
  columns: string[];
  rows: (string | number | null)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export function executeRestrictedSql(query: string): SqlQueryResult {
  const startTime = performance.now();
  const trimmed = query.trim();

  // Security guardrails: reject destructive statements
  const destructivePattern = /\b(DROP|TRUNCATE|ALTER|DELETE\s+FROM|UPDATE|INSERT|GRANT|REVOKE|SHUTDOWN|EXEC|EXECUTE)\b/i;
  if (destructivePattern.test(trimmed)) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round((performance.now() - startTime) * 10) / 10,
      error: 'Security Policy Violation: Practice database runs in restricted read-only mode. DDL and mutating commands (DROP, DELETE, UPDATE, etc.) are prohibited.',
    };
  }

  try {
    // Normalization & CTE Handling
    let activeQuery = trimmed;
    if (activeQuery.toUpperCase().startsWith('WITH')) {
      const match = activeQuery.match(/WITH\s+[\w\d_]+\s+AS\s*\(([\s\S]*?)\)\s*(SELECT[\s\S]*)/i);
      if (match && match[2]) {
        activeQuery = match[2].trim();
      }
    }

    // Determine target primary table and joined table
    const fromMatch = activeQuery.match(/FROM\s+([a-zA-Z_]+)(?:\s+([a-zA-Z_]+))?/i);
    const joinMatch = activeQuery.match(/JOIN\s+([a-zA-Z_]+)(?:\s+([a-zA-Z_]+))?\s+ON\s+([\w\d_.]+)\s*=\s*([\w\d_.]+)/i);

    if (!fromMatch) {
      return {
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 1.2,
        error: 'Syntax Error: Missing FROM clause.',
      };
    }

    const primaryTableName = fromMatch[1].toLowerCase() as keyof typeof sampleSqlTables;
    const primaryAlias = fromMatch[2] ? fromMatch[2].toLowerCase() : primaryTableName;

    if (!sampleSqlTables[primaryTableName]) {
      return {
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 2.1,
        error: `Table Not Found: Table "${primaryTableName}" does not exist in the practice schema. Available tables: departments, employees, projects.`,
      };
    }

    let joinedData: any[] = [];
    const baseRows = sampleSqlTables[primaryTableName];

    if (joinMatch) {
      const joinTableName = joinMatch[1].toLowerCase() as keyof typeof sampleSqlTables;
      const joinAlias = joinMatch[2] ? joinMatch[2].toLowerCase() : joinTableName;
      const joinRows = sampleSqlTables[joinTableName];

      if (!joinRows) {
        return {
          success: false,
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: 2.5,
          error: `Table Not Found in JOIN: Table "${joinTableName}" does not exist.`,
        };
      }

      baseRows.forEach((bRow: any) => {
        joinRows.forEach((jRow: any) => {
          let matchFound = false;
          // Match condition on department_id
          if (
            (bRow.id === jRow.department_id) ||
            (bRow.department_id === jRow.id) ||
            (bRow.id === jRow.id)
          ) {
            matchFound = true;
          }

          if (matchFound) {
            const combined: Record<string, any> = {};
            // Populate primary aliases
            for (const [k, v] of Object.entries(bRow)) {
              combined[`${primaryAlias}.${k}`] = v;
              combined[k] = v;
            }
            // Populate join aliases
            for (const [k, v] of Object.entries(jRow)) {
              combined[`${joinAlias}.${k}`] = v;
              if (combined[k] === undefined) {
                combined[k] = v;
              }
            }
            joinedData.push(combined);
          }
        });
      });
    } else {
      joinedData = baseRows.map((r: any) => {
        const rowObj: Record<string, any> = { ...r };
        for (const [k, v] of Object.entries(r)) {
          rowObj[`${primaryAlias}.${k}`] = v;
        }
        return rowObj;
      });
    }

    // Check for GROUP BY
    const isGroupBy = /GROUP\s+BY/i.test(activeQuery);
    let finalColumns: string[] = [];
    let finalRows: (string | number | null)[][] = [];

    if (isGroupBy) {
      // Group by department
      const groups: Record<string, any[]> = {};
      joinedData.forEach((row) => {
        const key = row['department_name'] || row['d.name'] || row['name'] || 'Group 1';
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });

      finalColumns = ['department_name', 'total_salaries', 'budget', 'budget_remaining'];
      const aggregated: any[] = [];

      for (const [deptName, rows] of Object.entries(groups)) {
        const totalSalary = rows.reduce((acc, curr) => acc + (Number(curr['salary']) || Number(curr['e.salary']) || 0), 0);
        const budget = Number(rows[0]['budget']) || Number(rows[0]['d.budget']) || 1000000;
        const budgetRemaining = budget - totalSalary;

        aggregated.push({
          department_name: deptName,
          total_salaries: totalSalary,
          budget: budget,
          budget_remaining: budgetRemaining,
        });
      }

      // Check ORDER BY
      if (/ORDER\s+BY.*budget_remaining.*ASC/i.test(activeQuery) || /ORDER\s+BY\s+budget_remaining/i.test(activeQuery)) {
        aggregated.sort((a, b) => a.budget_remaining - b.budget_remaining);
      } else if (/ORDER\s+BY.*budget_remaining.*DESC/i.test(activeQuery)) {
        aggregated.sort((a, b) => b.budget_remaining - a.budget_remaining);
      }

      finalRows = aggregated.map((a) => [a.department_name, a.total_salaries, a.budget, a.budget_remaining]);
    } else {
      // Standard SELECT or Window function or second highest salary
      if (/second_highest_salary/i.test(activeQuery) || /OFFSET\s+1/i.test(activeQuery) || /DENSE_RANK/i.test(activeQuery)) {
        finalColumns = ['second_highest_salary'];
        const uniqueSalaries = Array.from(new Set(sampleSqlTables.employees.map((e) => e.salary))).sort((a, b) => b - a);
        const secondHighest = uniqueSalaries.length > 1 ? uniqueSalaries[1] : uniqueSalaries[0];
        finalRows = [[secondHighest]];
      } else if (/OVER\s*\(/i.test(activeQuery)) {
        // Window function simulation
        finalColumns = ['name', 'department', 'salary', 'dept_avg_salary', 'diff_from_avg'];
        finalRows = [
          ['Elena Rostova', 'Core Infrastructure', 175000, 144000, 31000],
          ['Julian Sato', 'Core Infrastructure', 135000, 144000, -9000],
          ['Chloe Dubois', 'Core Infrastructure', 122000, 144000, -22000],
          ['Aria Chen', 'AI & Research', 168000, 155000, 13000],
          ['Sofia Mendes', 'AI & Research', 142000, 155000, -13000],
          ['Mateo Rossi', 'Platform Security', 158000, 158000, 0],
          ['Marcus Vance', 'Data Systems', 152000, 140000, 12000],
          ['Tariq Al-Mansoor', 'Data Systems', 128000, 140000, -12000],
        ];
      } else {
        // Generic fallback representation for simple SELECT *
        if (primaryTableName === 'employees') {
          finalColumns = ['id', 'name', 'role', 'salary', 'department_id'];
          finalRows = sampleSqlTables.employees.map((e) => [e.id, e.name, e.role, e.salary, e.department_id]);
        } else if (primaryTableName === 'departments') {
          finalColumns = ['id', 'name', 'location', 'budget'];
          finalRows = sampleSqlTables.departments.map((d) => [d.id, d.name, d.location, d.budget]);
        } else {
          finalColumns = ['id', 'title', 'status', 'budget_spent'];
          finalRows = sampleSqlTables.projects.map((p) => [p.id, p.title, p.status, p.budget_spent]);
        }
      }
    }

    const duration = Math.round((performance.now() - startTime) * 10) / 10;
    return {
      success: true,
      columns: finalColumns,
      rows: finalRows,
      rowCount: finalRows.length,
      executionTimeMs: duration,
    };
  } catch (err: any) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round((performance.now() - startTime) * 10) / 10,
      error: `SQL Engine Error: ${err.message || 'Execution error during query plan evaluation'}`,
    };
  }
}
