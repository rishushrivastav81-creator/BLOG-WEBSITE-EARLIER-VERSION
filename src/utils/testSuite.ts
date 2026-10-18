/**
 * Automated test suite for PadhoWithUs Code Academy & Publication
 * Tests:
 * 1. SQL Restricted Execution & Security Guards
 * 2. SQL Relational Aggregations & Math
 * 3. Python Execution Sandbox & Forbidden Call Blocking
 * 4. Algorithm Verification (Two Sum & Balanced Parentheses)
 */

import { executeRestrictedSql } from '../utils/sqlRunner';
import { executePythonCode } from '../utils/pythonRunner';

export function runAllAppletTests(): { total: number; passed: number; results: { name: string; ok: boolean; message?: string }[] } {
  const tests: { name: string; run: () => void }[] = [];
  const results: { name: string; ok: boolean; message?: string }[] = [];

  // Test 1: SQL Security Check
  tests.push({
    name: 'SQL Runner rejects DROP TABLE injection attempts',
    run: () => {
      const res = executeRestrictedSql('DROP TABLE employees;');
      if (res.success || !res.error?.includes('Security Policy Violation')) {
        throw new Error('Expected DROP TABLE to be rejected by security policy');
      }
    },
  });

  // Test 2: SQL Budget Aggregation
  tests.push({
    name: 'SQL Runner correctly computes departmental salary aggregation',
    run: () => {
      const query = `
        SELECT d.name, SUM(e.salary), d.budget, (d.budget - SUM(e.salary)) AS budget_remaining
        FROM departments d
        JOIN employees e ON e.department_id = d.id
        GROUP BY d.id, d.name, d.budget
        ORDER BY budget_remaining ASC;
      `;
      const res = executeRestrictedSql(query);
      if (!res.success) throw new Error(res.error || 'Failed query execution');
      if (res.rowCount !== 4) throw new Error(`Expected 4 rows, got ${res.rowCount}`);
    },
  });

  // Test 3: Python Security Check
  tests.push({
    name: 'Python Runner blocks os and subprocess imports',
    run: () => {
      const code = 'import os\nprint(os.listdir("."))';
      const res = executePythonCode(code);
      if (res.success || !res.stderr.includes('Security Policy Sandbox Error')) {
        throw new Error('Expected OS import to be blocked');
      }
    },
  });

  // Test 4: Algorithmic Verification
  tests.push({
    name: 'Python Runner validates two_sum test cases',
    run: () => {
      const code = `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
`;
      const res = executePythonCode(code, [{ input: 'two_sum([2, 7, 11, 15], 9)', expectedOutput: '[0, 1]' }]);
      if (!res.success) throw new Error('two_sum test case failed');
    },
  });

  for (const t of tests) {
    try {
      t.run();
      results.push({ name: t.name, ok: true });
    } catch (e: any) {
      results.push({ name: t.name, ok: false, message: e.message });
    }
  }

  const passed = results.filter((r) => r.ok).length;
  return { total: tests.length, passed, results };
}
