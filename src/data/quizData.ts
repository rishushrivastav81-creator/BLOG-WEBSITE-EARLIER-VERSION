import { TopicQuiz, Badge } from '../types';

export const allBadges: Badge[] = [
  {
    id: 'badge-first-query',
    name: 'Query Crafter',
    description: 'Executed your first successful SQL query in the Practice Arena.',
    icon: 'Database',
  },
  {
    id: 'badge-python-streak',
    name: 'Async Virtuoso',
    description: 'Completed Python systems engineering challenges without hints.',
    icon: 'Terminal',
  },
  {
    id: 'badge-quiz-ace',
    name: 'Relational Architect',
    description: 'Scored 100% on the Advanced SQL & Performance Architecture Quiz.',
    icon: 'Award',
  },
  {
    id: 'badge-nomad-reader',
    name: 'Global Explorer',
    description: 'Read 3 or more technical travel field guides in the journal.',
    icon: 'Compass',
  },
  {
    id: 'badge-7-day-streak',
    name: 'Iron Focus',
    description: 'Maintained a 7-day daily learning streak in the academy.',
    icon: 'Flame',
  },
];

export const initialQuizzes: TopicQuiz[] = [
  {
    id: 'quiz-sql-performance',
    title: 'Advanced SQL Query Optimization & Planner Internals',
    description: 'Test your understanding of cost calculations, B-Tree index scan vs bitmap scan, and window function partitioning.',
    category: 'Databases & SQL',
    timeLimitSeconds: 180,
    xpReward: 150,
    badgeName: 'Relational Architect',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        points: 25,
        question: 'When PostgreSQL evaluates a query with "WHERE status = 1 ORDER BY created_at DESC LIMIT 10", which index provides the lowest execution cost?',
        options: [
          'Two separate single-column B-tree indexes: one on status, one on created_at',
          'A composite B-tree index on (status, created_at DESC)',
          'A hash index on status',
          'A GIN index on created_at',
        ],
        correctAnswers: [1],
        explanation: 'A composite index on (status, created_at DESC) allows the query engine to filter matching rows by status and read tuples directly in already-sorted reverse chronological order, eliminating an in-memory Sort node.',
      },
      {
        id: 'q2',
        type: 'output-prediction',
        difficulty: 'intermediate',
        points: 25,
        question: 'What is the exact output of evaluating this SQL expression?',
        codeSnippet: `SELECT COALESCE(NULL, NULL, 42, 99);`,
        options: ['NULL', '42', '99', 'Error: Multiple non-null arguments'],
        correctAnswers: [1],
        explanation: 'COALESCE returns the first non-null argument in its argument list. Since the first two are NULL, it immediately returns 42 and does not evaluate further.',
      },
      {
        id: 'q3',
        type: 'multi-select',
        difficulty: 'advanced',
        points: 30,
        question: 'Which of the following conditions prevent a B-tree index from being used by the optimizer? (Select all that apply)',
        options: [
          'Wrapping the indexed column in an un-indexed expression, e.g. WHERE LOWER(email) = "x"',
          'Using a LIKE query with a leading wildcard, e.g. WHERE name LIKE "%smith"',
          'Using an equality check WHERE id = 500',
          'Mismatching data types that force implicit casting on the indexed column',
        ],
        correctAnswers: [0, 1, 3],
        explanation: 'Expressions like LOWER(col) prevent standard B-tree lookups unless an expression index exists. Leading wildcards prevent index tree traversal. Type coercion on the column disables index scans. Simple equality uses the index normally.',
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        difficulty: 'advanced',
        points: 20,
        question: 'What is the primary difference between a clustered index and a non-clustered index?',
        options: [
          'A clustered index dictates the physical on-disk ordering of table rows; a non-clustered index maintains a separate pointer structure.',
          'A clustered index can only be created on UUID columns.',
          'Non-clustered indexes do not support binary tree searches.',
          'There can be up to 16 clustered indexes per table in Postgres.',
        ],
        correctAnswers: [0],
        explanation: 'A table can only have one clustered ordering because table rows can only physically be arranged in one order on disk.',
      },
    ],
  },
  {
    id: 'quiz-python-concurrency',
    title: 'Python Memory Model, Concurrency & Asyncio',
    description: 'Validate your knowledge of the GIL, reference counting, cooperative multitasking, and CPU-bound vs I/O-bound bottlenecks.',
    category: 'Python & Systems',
    timeLimitSeconds: 150,
    xpReward: 120,
    badgeName: 'Async Virtuoso',
    questions: [
      {
        id: 'py-q1',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        points: 25,
        question: 'Why does Python threading NOT accelerate compute-heavy mathematical loops across multiple CPU cores?',
        options: [
          'The Global Interpreter Lock (GIL) allows only one native thread to execute Python bytecode at a time',
          'Operating systems do not permit threads in interpreted languages',
          'Python integers do not support parallel arithmetic',
          'Threads cannot share RAM memory addresses',
        ],
        correctAnswers: [0],
        explanation: 'In CPython, the GIL serializes bytecode execution, meaning CPU-bound tasks cannot run in true parallel on multiple cores within a single Python process.',
      },
      {
        id: 'py-q2',
        type: 'output-prediction',
        difficulty: 'beginner',
        points: 25,
        question: 'What does the following snippet print?',
        codeSnippet: `def append_item(x, lst=[]):
    lst.append(x)
    return lst

print(append_item(1))
print(append_item(2))`,
        options: ['[1] and [2]', '[1] and [1, 2]', '[1] and []', 'TypeError'],
        correctAnswers: [1],
        explanation: 'Default argument expressions in Python are evaluated once at function definition time, not upon each call. The same mutable list is retained and modified across calls.',
      },
      {
        id: 'py-q3',
        type: 'multi-select',
        difficulty: 'advanced',
        points: 30,
        question: 'Which techniques allow scaling CPU-intensive workloads in Python across multiple CPU cores? (Select all that apply)',
        options: [
          'Using multiprocessing or ProcessPoolExecutor to spawn isolated OS processes',
          'Offloading numerical vector operations to C/Rust extensions (e.g. NumPy, PyTorch) that release the GIL',
          'Using async def with asyncio.gather() on synchronous CPU loops',
          'Using Python 3.13+ experimental free-threaded (no-GIL) build',
        ],
        correctAnswers: [0, 1, 3],
        explanation: 'Multiprocessing spawns independent processes with separate GILs. C extensions release the GIL during heavy SIMD computation. Python 3.13 free-threading removes the GIL. Asyncio is single-threaded cooperative multitasking and does not scale CPU-bound work.',
      },
    ],
  },
];
