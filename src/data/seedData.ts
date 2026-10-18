import { Article, Author } from '../types';

export const authors: Author[] = [
  {
    id: 'author-1',
    name: 'Elena Rostova',
    role: 'Principal Distributed Systems Architect',
    bio: 'Former staff engineer at high-frequency trading firms. Writes about consensus protocols, zero-allocation runtimes, and nomad hacking in Japan.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    location: 'Kyoto / Berlin',
    articlesCount: 14,
  },
  {
    id: 'author-2',
    name: 'Marcus Vance',
    role: 'Database Systems & SQL Lead',
    bio: 'PostgreSQL contributor, query planner specialist, and alpine trail runner. Passionate about cost-based optimizers and quiet coffee shops across South America.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    location: 'Medellín / Zurich',
    articlesCount: 19,
  },
  {
    id: 'author-3',
    name: 'Aria Chen',
    role: 'AI Research Engineer & Generative Systems',
    bio: 'Focusing on multi-agent cognitive architectures, context compaction, and fine-tuning reasoning models. Writes from coastal co-working spaces in Southern Europe.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
    location: 'Lisbon / Singapore',
    articlesCount: 11,
  },
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    slug: 'designing-zero-allocation-high-throughput-systems',
    title: 'Designing Zero-Allocation High-Throughput Microservices in Go & Rust',
    excerpt: 'How cache-conscious memory layouts, memory arenas, and lock-free rings reduce p99.9 latency from 45ms to 1.8ms under 120,000 requests per second.',
    body: `### The Physics of Microsecond Latency

When scaling services to handle hundred-thousand-concurrency workloads, the central bottleneck in garbage-collected runtimes is almost never raw CPU compute. It is memory allocator churn and cache-line invalidation.

In high-throughput microservices, allocating thousands of small objects per request triggers frequent generational sweeps, memory fragmentation, and TLB (Translation Lookaside Buffer) misses.

\`\`\`go
// Anti-pattern: Allocating slices inside the hot loop
func ProcessPacket(buf []byte) *Telemetry {
    // Triggers heap allocation per packet
    t := new(Telemetry)
    t.Timestamp = time.Now().UnixNano()
    t.Payload = make([]byte, len(buf))
    copy(t.Payload, buf)
    return t
}
\`\`\`

#### The Arena Allocation Paradigm

Instead of allocating per unit of work, high-performance backends pre-allocate contiguous arenas. By pooling fixed-size memory blocks, we bypass the OS runtime allocator entirely:

\`\`\`go
// Arena-backed buffer pooling with sync.Pool
var packetPool = sync.Pool{
    New: func() any {
        b := make([]byte, 4096)
        return &b
    },
}

func ProcessPacketPooled(raw []byte, sink chan<- []byte) {
    bufPtr := packetPool.Get().(*[]byte)
    buf := *bufPtr
    n := copy(buf, raw)
    sink <- buf[:n]
}
\`\`\`

### Cache-Conscious Data Structures

Modern x86-64 and ARM64 CPUs pull data in 64-byte cache lines. When structuring records:
1. **Sort fields by descending size** to eliminate compiler-injected padding bytes.
2. **Prefer Structure-of-Arrays (SoA)** over Array-of-Structures (AoS) when performing batch filter passes.
3. **Avoid pointer chasing**: Flatten linked nodes into contiguous ring buffers.

In production benchmarks across 8-node Kubernetes clusters, moving from heap-allocated payloads to pre-warmed ring buffers reduced our service p99 latency from 42.4ms to 1.84ms at sustained 100k RPS.`,
    coverImage: '/src/assets/images/article_distributed_systems_1792296527506.jpg',
    imageAlt: 'High performance data center server rack with illuminated fiber connections',
    category: 'engineering',
    tags: ['Go', 'Rust', 'Distributed Systems', 'Performance', 'Concurrency'],
    author: authors[0],
    publishedAt: '2026-09-14',
    updatedAt: '2026-10-02',
    readTimeMinutes: 8,
    featured: true,
    status: 'published',
    views: 18450,
    likes: 934,
    seoTitle: 'Zero-Allocation High-Throughput Microservices: Go & Rust Guide',
    seoDescription: 'Master memory arenas, lock-free queues, and cache-conscious data layouts to achieve microsecond p99 latency in production services.',
    canonicalUrl: 'https://padhowithus.dev/blog/designing-zero-allocation-high-throughput-systems',
  },
  {
    id: 'art-2',
    slug: 'engineers-guide-remote-work-kyoto',
    title: "The Engineer's Field Guide to Remote Work in Kyoto: Machiya Spaces, Fiber Internet & Autumn Alleys",
    excerpt: 'Beyond the tourist postcard: Finding silent tea houses with 1 Gbps fiber, registering digital nomad visas, and engineering high-focus deep work routines in Japan ancient capital.',
    body: `### Why Kyoto Is the World's Best City for Deep Work

Software architecture requires deep uninterrupted focus. While Tokyo offers neon-charged momentum, Kyoto operates at the cadence of a temple bell. For developers building distributed systems or studying complex algorithmic concepts, Kyoto offers a unique combination of Japanese modern infrastructure with tranquil monastic discipline.

#### The Connectivity Reality: Fiber & Machiya Co-Working

Japan's domestic fiber infrastructure (NTT FLETS and NURO Hikari) is among the most reliable globally. Even centuries-old wooden machiya houses in Kamigyo and Sakyo wards are wired with symmetrical 1 Gbps FTTH lines.

* **Kamigyo Machiya Tech Lab**: A renovated Edo-era townhouse converted into an engineering workspace. Ergonomic Herman Miller seating alongside tatami rest alcoves and 850 Mbps symmetrical Wi-Fi 6.
* **Philosopher’s Path Coffee & Code**: Located in northeast Kyoto near Ginkaku-ji, ideal for morning system design note-taking followed by afternoon coding sprints.
* **Kyoto Station Shinkansen Lounge**: Equipped with soundproof sound booths, universal power outlets, and low-latency connections for remote deploy monitoring.

\`\`\`bash
# Typical latency benchmarks from Kyoto to AWS AP-Northeast (Tokyo)
$ ping -c 5 ap-northeast-1.compute.amazonaws.com
PING ap-northeast-1: 64 bytes: icmp_seq=1 ttl=56 time=8.41 ms
PING ap-northeast-1: 64 bytes: icmp_seq=2 ttl=56 time=8.29 ms
--- ap-northeast-1 ping statistics ---
rtt min/avg/max/mdev = 8.12/8.34/8.60/0.14 ms
\`\`\`

#### The Daily Engineering Routine

1. **06:30 AM**: Walking meditation through the Arashiyama bamboo forest or the stone lanes of Gion before visitors arrive.
2. **08:30 AM – 1:00 PM**: Deep code execution block during European/American off-hours.
3. **01:00 PM**: Soba lunch in a neighborhood shokudo (¥800 / $5.50).
4. **02:30 PM – 5:30 PM**: System reviews, documentation, and async pull request merges.
5. **07:00 PM**: Onsen soak in Kurama hot springs to dissolve cognitive fatigue.

Kyoto proves that remote technical work doesn't require sterile suburban office parks. High craftsmanship in software naturally complements the craftsmanship of Kyoto's artisans.`,
    coverImage: '/src/assets/images/travel_kyoto_guide_1792296527567.jpg',
    imageAlt: 'Tranquil historic stone lane in Kyoto with glowing lanterns at dusk',
    category: 'travel',
    tags: ['Kyoto', 'Japan', 'Remote Work', 'Digital Nomad', 'Deep Work'],
    author: authors[0],
    publishedAt: '2026-09-28',
    updatedAt: '2026-10-10',
    readTimeMinutes: 11,
    featured: true,
    status: 'published',
    views: 14210,
    likes: 812,
    seoTitle: "Engineer's Guide to Working Remotely in Kyoto, Japan",
    seoDescription: 'Find high-speed fiber coworking spaces, machiya rentals, and remote engineering routines in Kyoto.',
    canonicalUrl: 'https://padhowithus.dev/blog/engineers-guide-remote-work-kyoto',
  },
  {
    id: 'art-3',
    slug: 'inside-modern-postgresql-query-planner',
    title: 'Inside Modern PostgreSQL Query Planners: Cost Models, Statistics & Join Order Heuristics',
    excerpt: 'Demystifying EXPLAIN (ANALYZE, BUFFERS): How the Postgres optimizer calculates disk page costs, evaluates index selectivity, and chooses between Hash, Merge, and Nested Loop joins.',
    body: `### How PostgreSQL Decides Your Query Strategy

Every time you execute a SQL query, PostgreSQL passes the raw string through four distinct subsystems:
1. **Parser**: Generates the parse tree and checks grammar.
2. **Rewriter**: Applies view definitions and row-level security rules.
3. **Planner/Optimizer**: Explores hundreds of possible execution paths and picks the path with lowest estimated total cost.
4. **Executor**: Evaluates the plan nodes step-by-step to emit tuple streams.

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.name, count(o.id) AS total_orders
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.created_at >= '2026-01-01'
GROUP BY u.name
ORDER BY total_orders DESC
LIMIT 10;
\`\`\`

#### The Cost Unit System

PostgreSQL cost values are expressed in arbitrary units defined by configuration constants:
* \`seq_page_cost\` (Default 1.0): The cost to fetch a 8KB disk page sequentially.
* \`random_page_cost\` (Default 4.0): The cost to fetch a random page on spinning disks. On modern NVMe SSDs, tune this down to 1.1–1.2 to encourage index usage.
* \`cpu_tuple_cost\` (Default 0.01): Cost to process each row.
* \`cpu_operator_cost\` (Default 0.0025): Cost to evaluate each expression or WHERE condition.

#### Join Selection Strategy

* **Nested Loop**: Ideal when outer set is small and inner table has an index on join keys (O(N * log M)).
* **Hash Join**: Best for medium to large unsorted sets where the build relation fits comfortably in \`work_mem\`.
* **Merge Join**: Optimal when both tables are already sorted by the join key via B-tree indexes or previous pipeline stages.`,
    coverImage: '/src/assets/images/tutorial_python_ai_1792296528316.jpg',
    imageAlt: 'Engineering workspace analyzing database execution graphs',
    category: 'engineering',
    tags: ['PostgreSQL', 'Databases', 'SQL', 'Performance', 'Query Planning'],
    author: authors[1],
    publishedAt: '2026-10-04',
    updatedAt: '2026-10-12',
    readTimeMinutes: 10,
    featured: false,
    status: 'published',
    views: 9340,
    likes: 642,
    seoTitle: 'Inside the PostgreSQL Query Planner: Cost Models & Join Algorithms',
    seoDescription: 'Master EXPLAIN ANALYZE, page costs, work_mem, and join heuristics to optimize database queries.',
    canonicalUrl: 'https://padhowithus.dev/blog/inside-modern-postgresql-query-planner',
  },
  {
    id: 'art-4',
    slug: 'lisbon-digital-nomads-coworking-coastal-escapes',
    title: 'Lisbon for Software Builders: The Ultimate Guide to Coworking, Fiber Internet & Atlantic Escapes',
    excerpt: 'Navigating Portugal tech scene: Top tech hubs in Chiado and Marvila, cost-of-living breakdowns, D8 digital nomad visa requirements, and weekend surf breaks in Ericeira.',
    body: `### The Silicon Coast of Southern Europe

Lisbon has transformed into Europe's premier destination for distributed engineering teams. With over 300 days of sunlight per year, an established English-speaking tech ecosystem, and convenient GMT timezone parity with London, Lisbon provides an unmatched balance of quality of life and high-caliber networking.

#### Top Neighborhoods for Technical Work

* **Marvila (The Innovation District)**: Former industrial warehouses converted into modern hacker spaces, specialty craft breweries, and tech incubators like Unicorn Factory Lisboa.
* **Príncipe Real & Chiado**: Classic 19th-century architecture hosting boutique coworking spaces such as Second Home Lisboa, immersed in botanical gardens with high-speed fiber internet.
* **Santos**: Close to the river Tagus, popular with freelance product designers and AI founders.

#### Internet Speed & Mobile Tech

* **Vodafone & MEO**: Symmetrical 1 Gbps fiber connections are standard across residential apartments and co-living spaces for €35–€45/month.
* **5G Coverage**: Consistent sub-15ms latency across Lisbon metropolitan area.

#### Digital Nomad Visa (D8) Essentials

Portugal's D8 visa allows remote software engineers to establish legal residency if they demonstrate monthly foreign income exceeding 4x the Portuguese minimum wage (~€3,280/month in 2026).`,
    coverImage: '/src/assets/images/hero_nomad_coding_1792296527037.jpg',
    imageAlt: 'Software engineer coding with sea views',
    category: 'travel',
    tags: ['Lisbon', 'Portugal', 'Europe', 'Coworking', 'Digital Nomad'],
    author: authors[2],
    publishedAt: '2026-10-08',
    updatedAt: '2026-10-15',
    readTimeMinutes: 7,
    featured: false,
    status: 'published',
    views: 11200,
    likes: 720,
    seoTitle: 'Lisbon Remote Work Guide for Tech Professionals & Nomads',
    seoDescription: 'The comprehensive guide to coworking spaces, high-speed fiber internet, and living in Lisbon as a remote engineer.',
    canonicalUrl: 'https://padhowithus.dev/blog/lisbon-digital-nomads-coworking-coastal-escapes',
  },
  {
    id: 'art-5',
    slug: 'cognitive-architectures-agentic-llm-systems',
    title: 'Cognitive Architectures for Agentic AI: Memory Hierarchies, Tool Routing & Self-Reflection',
    excerpt: 'Building resilient agentic loops that do not hallucinate: Combining episodic memory in vector indexes, semantic tool contracts, and automated verification judges.',
    body: `### Why Simple Prompt Chains Fail in Complex Workflows

Single-turn prompt engineering and naive ReAct loops collapse when given multi-step problems requiring deterministic reliability. An autonomous system needs:
1. **Working Memory**: In-context state representing the current sub-task.
2. **Episodic Memory**: Semantic recall of past task executions, tool failures, and successful strategies.
3. **Strict Tool Contracts**: JSON Schema validation with deterministic error handling and automatic retry budgets.
4. **Reflection & Verification**: A secondary discriminator model or rule-based evaluator that checks intermediate outputs against acceptance criteria before mutating external state.

\`\`\`python
# Resilient Tool Execution Protocol with Schema Validation
from pydantic import BaseModel, Field

class DatabaseQueryPlan(BaseModel):
    sql: str = Field(description="Strictly read-only SELECT query")
    timeout_ms: int = Field(default=2000, description="Query execution timeout")
    estimated_cost_limit: float = Field(default=100.0)

def execute_with_guardrails(plan: DatabaseQueryPlan) -> dict:
    if not plan.sql.strip().upper().startswith("SELECT"):
        raise PermissionError("Mutating SQL queries are rejected by security policy")
    return run_sandboxed_query(plan.sql, plan.timeout_ms)
\`\`\`

By decoupling intent parsing from deterministic execution guardrails, we eliminate 99.4% of common runtime agent failures.`,
    coverImage: '/src/assets/images/tutorial_python_ai_1792296528316.jpg',
    imageAlt: 'AI and neural system architectures visualized on high resolution displays',
    category: 'ai',
    tags: ['AI', 'LLMs', 'Agentic Systems', 'Python', 'Architecture'],
    author: authors[2],
    publishedAt: '2026-10-11',
    updatedAt: '2026-10-16',
    readTimeMinutes: 9,
    featured: false,
    status: 'published',
    views: 8400,
    likes: 512,
    seoTitle: 'Cognitive Architectures for Agentic AI: Memory & Tool Routing',
    seoDescription: 'Learn how to construct production-ready AI agents using memory hierarchies, tool contracts, and self-reflection loops.',
    canonicalUrl: 'https://padhowithus.dev/blog/cognitive-architectures-agentic-llm-systems',
  },
];
