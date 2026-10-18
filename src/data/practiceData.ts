import { PracticeProblem } from '../types';

export const sampleSqlTables = {
  departments: [
    { id: 1, name: 'Core Infrastructure', location: 'Floor 4, Kyoto Hub', budget: 1200000 },
    { id: 2, name: 'AI & Research', location: 'Floor 6, Berlin Campus', budget: 2400000 },
    { id: 3, name: 'Data Systems', location: 'Floor 2, Lisbon Lab', budget: 950000 },
    { id: 4, name: 'Platform Security', location: 'Floor 3, Zurich Tower', budget: 880000 },
  ],
  employees: [
    { id: 101, name: 'Elena Rostova', department_id: 1, role: 'Principal Architect', salary: 175000, hire_date: '2022-03-15' },
    { id: 102, name: 'Marcus Vance', department_id: 3, role: 'Database Lead', salary: 152000, hire_date: '2021-08-01' },
    { id: 103, name: 'Aria Chen', department_id: 2, role: 'Senior AI Engineer', salary: 168000, hire_date: '2023-01-10' },
    { id: 104, name: 'Julian Sato', department_id: 1, role: 'Systems Engineer', salary: 135000, hire_date: '2022-11-20' },
    { id: 105, name: 'Sofia Mendes', department_id: 2, role: 'ML Ops Specialist', salary: 142000, hire_date: '2023-06-01' },
    { id: 106, name: 'Mateo Rossi', department_id: 4, role: 'Security Architect', salary: 158000, hire_date: '2020-05-18' },
    { id: 107, name: 'Tariq Al-Mansoor', department_id: 3, role: 'Data Engineer', salary: 128000, hire_date: '2024-02-14' },
    { id: 108, name: 'Chloe Dubois', department_id: 1, role: 'Network Engineer', salary: 122000, hire_date: '2024-04-01' },
  ],
  projects: [
    { id: 501, title: 'Zero-Allocation Gateway', department_id: 1, status: 'Completed', budget_spent: 340000 },
    { id: 502, title: 'Distributed Vector Index', department_id: 2, status: 'In Progress', budget_spent: 820000 },
    { id: 503, title: 'Postgres Optimizer Tuning', department_id: 3, status: 'In Progress', budget_spent: 190000 },
    { id: 504, title: 'Zero-Trust Service Mesh', department_id: 4, status: 'Completed', budget_spent: 410000 },
  ],
};

export const initialPracticeProblems: PracticeProblem[] = [
  {
    id: 'prob-sql-1',
    slug: 'department-budget-and-salary-disparity',
    title: 'Department Salary Expenditure vs. Allocated Budget',
    category: 'sql',
    difficulty: 'intermediate',
    description: `Write a SQL query that calculates the total employee salary expenditure for each department and compares it to the department's allocated budget.

Output columns required:
- \`department_name\` (the name of the department)
- \`total_salaries\` (the sum of salaries of all employees in that department)
- \`budget\` (the department's total allocated budget)
- \`budget_remaining\` (\`budget - total_salaries\`)

Order the results by \`budget_remaining\` in ascending order (departments with the least headroom first).`,
    sampleInput: 'Tables: departments, employees',
    sampleOutput: `+---------------------+----------------+---------+------------------+
| department_name     | total_salaries | budget  | budget_remaining |
+---------------------+----------------+---------+------------------+
| Core Infrastructure | 432000         | 1200000 | 768000           |
| Platform Security   | 158000         | 880000  | 722000           |
| Data Systems        | 280000         | 950000  | 670000           |
| AI & Research       | 310000         | 2400000 | 2090000          |
+---------------------+----------------+---------+------------------+`,
    starterCode: `-- Calculate total salary expenditure and budget remaining per department
SELECT 
    d.name AS department_name,
    -- TODO: Compute sum of salaries and remaining budget
    d.budget
FROM departments d
-- TODO: Join employees table
GROUP BY d.id, d.name, d.budget
ORDER BY department_name;`,
    solutionCode: `SELECT 
    d.name AS department_name,
    SUM(e.salary) AS total_salaries,
    d.budget AS budget,
    (d.budget - SUM(e.salary)) AS budget_remaining
FROM departments d
JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name, d.budget
ORDER BY budget_remaining ASC;`,
    hints: [
      'Use an INNER JOIN between departments d and employees e on d.id = e.department_id.',
      'GROUP BY d.id, d.name, d.budget so you can compute SUM(e.salary).',
      'Order by the calculated expression or alias budget_remaining ASC.',
    ],
    testCases: [
      {
        input: 'Run query against test database',
        expectedOutput: '4 rows grouped by department with accurate SUM(salary) and budget_remaining math',
      },
    ],
    sqlSchema: `CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100),
  budget INT
);

CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT REFERENCES departments(id),
  role VARCHAR(100),
  salary INT,
  hire_date DATE
);`,
    explanation: 'By aggregating salaries using SUM(e.salary) inside a GROUP BY clause, we can calculate the difference against d.budget. Joining on department_id ensures every employee is accounted for under their corresponding organizational unit.',
  },
  {
    id: 'prob-sql-2',
    slug: 'second-highest-salary-dense-rank',
    title: 'Find the Second Highest Salary Across Departments',
    category: 'sql',
    difficulty: 'beginner',
    description: `Write a SQL query to find the second highest employee salary across the entire company. If there are multiple employees tied for the second highest salary, return that distinct salary amount.

Output column required:
- \`second_highest_salary\`

Tip: You can use \`DISTINCT\`, \`ORDER BY\`, and \`LIMIT / OFFSET\`, or a window function.`,
    sampleInput: 'Table: employees',
    sampleOutput: `+-----------------------+
| second_highest_salary |
+-----------------------+
| 168000                |
+-----------------------+`,
    starterCode: `-- Find the second highest distinct salary
SELECT 
    -- TODO: Select second highest salary
FROM employees;`,
    solutionCode: `SELECT DISTINCT salary AS second_highest_salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`,
    hints: [
      'Use DISTINCT to handle multiple employees who might share the exact same salary.',
      'Sort DESC and use LIMIT 1 OFFSET 1 to grab the second entry.',
    ],
    testCases: [
      {
        input: 'Employees salaries: [175000, 168000, 158000, 152000, ...]',
        expectedOutput: '168000',
      },
    ],
    explanation: 'Using SELECT DISTINCT salary ORDER BY salary DESC LIMIT 1 OFFSET 1 efficiently bypasses the top value and selects the second highest distinct numerical salary.',
  },
  {
    id: 'prob-py-1',
    slug: 'two-sum-linear-lookup',
    title: 'Two Sum with Optimal O(N) Hash Table',
    category: 'python',
    difficulty: 'beginner',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You must achieve **O(N)** time complexity.`,
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # TODO: Implement O(N) solution using a dictionary
    pass

# Test execution:
print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(two_sum([3, 2, 4], 6))        # Expected: [1, 2]
print(two_sum([3, 3], 6))           # Expected: [0, 1]`,
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution:
print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))
print(two_sum([3, 3], 6))`,
    hints: [
      'As you iterate through the list, compute complement = target - num.',
      'Check if complement is already present in your hash table seen. If so, return [seen[complement], current_index].',
      'Otherwise, record seen[num] = current_index.',
    ],
    testCases: [
      { input: 'two_sum([2, 7, 11, 15], 9)', expectedOutput: '[0, 1]' },
      { input: 'two_sum([3, 2, 4], 6)', expectedOutput: '[1, 2]' },
      { input: 'two_sum([3, 3], 6)', expectedOutput: '[0, 1]' },
    ],
    explanation: 'A brute force nested loop takes O(N^2) time. By using a hash table to store previously seen numbers and their indices, we can check for the complement in O(1) average time, reducing overall runtime to O(N) with O(N) space.',
  },
  {
    id: 'prob-py-2',
    slug: 'valid-parentheses-stack-validator',
    title: 'Balanced Syntax & Bracket Parser',
    category: 'python',
    difficulty: 'intermediate',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'True',
    starterCode: `def is_valid_brackets(s: str) -> bool:
    # TODO: Implement stack-based parser
    pass

# Test cases:
print(is_valid_brackets("()[]{}"))  # Expected: True
print(is_valid_brackets("(]"))      # Expected: False
print(is_valid_brackets("([)]"))    # Expected: False
print(is_valid_brackets("{[]}"))    # Expected: True`,
    solutionCode: `def is_valid_brackets(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

# Test cases:
print(is_valid_brackets("()[]{}"))
print(is_valid_brackets("(]"))
print(is_valid_brackets("([)]"))
print(is_valid_brackets("{[]}"))`,
    hints: [
      'Use a list as a Last-In First-Out (LIFO) stack.',
      'When you encounter a closing bracket, pop the top of the stack and ensure it matches the corresponding open bracket.',
      'At the end of the string, the stack must be completely empty.',
    ],
    testCases: [
      { input: 'is_valid_brackets("()[]{}")', expectedOutput: 'True' },
      { input: 'is_valid_brackets("(]")', expectedOutput: 'False' },
      { input: 'is_valid_brackets("{[]}")', expectedOutput: 'True' },
    ],
    explanation: 'A stack is the canonical structure for parsing nested recursive grammars. By pairing closing tokens with popped opening tokens from the stack, we verify syntax balance in O(N) time and O(N) space.',
  },
  {
    id: 'prob-sql-3',
    slug: 'department-project-budget-utilization',
    title: 'Department Project Budget Utilization & Rank',
    category: 'sql',
    difficulty: 'advanced',
    description: `Write a SQL query that joins the \`departments\` and \`projects\` tables to compute the total project budget spent per department, the department's total allocated budget, and calculates a percentage utilization. Rank the departments by utilization descending.

Output columns required:
- \`department_name\`
- \`total_project_spent\`
- \`budget\`
- \`utilization_pct\` (rounded to 1 decimal place)

Filter only completed projects or projects with spent budget > 0.`,
    sampleInput: 'Tables: departments, projects',
    sampleOutput: `+---------------------+---------------------+---------+-----------------+
| department_name     | total_project_spent | budget  | utilization_pct |
+---------------------+---------------------+---------+-----------------+
| Platform Security   | 410000              | 880000  | 46.6            |
| AI & Research       | 820000              | 2400000 | 34.2            |
| Core Infrastructure | 340000              | 1200000 | 28.3            |
| Data Systems        | 190000              | 950000  | 20.0            |
+---------------------+---------------------+---------+-----------------+`,
    starterCode: `-- Compute total project spend and utilization rate per department
SELECT 
    d.name AS department_name,
    SUM(p.budget_spent) AS total_project_spent,
    d.budget,
    ROUND(CAST(SUM(p.budget_spent) AS FLOAT) / d.budget * 100, 1) AS utilization_pct
FROM departments d
JOIN projects p ON p.department_id = d.id
GROUP BY d.id, d.name, d.budget
ORDER BY utilization_pct DESC;`,
    solutionCode: `SELECT 
    d.name AS department_name,
    SUM(p.budget_spent) AS total_project_spent,
    d.budget,
    ROUND(CAST(SUM(p.budget_spent) AS FLOAT) / d.budget * 100, 1) AS utilization_pct
FROM departments d
JOIN projects p ON p.department_id = d.id
GROUP BY d.id, d.name, d.budget
ORDER BY utilization_pct DESC;`,
    hints: [
      'Join departments with projects on d.id = p.department_id.',
      'Use SUM(p.budget_spent) and compute (SUM(p.budget_spent) / d.budget) * 100.',
      'Group by d.id, d.name, d.budget and order by utilization_pct DESC.',
    ],
    testCases: [
      {
        input: 'Run against departments & projects tables',
        expectedOutput: '4 departments ranked by budget utilization rate',
      },
    ],
    explanation: 'Grouping by department and computing aggregate project costs allows calculating capital allocation efficiency and detecting over-budget risk early.',
  },
];
