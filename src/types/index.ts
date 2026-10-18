export type ArticleCategory = 'engineering' | 'ai' | 'travel' | 'career' | 'architecture';

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  location: string;
  articlesCount: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  imageAlt: string;
  category: ArticleCategory;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featured?: boolean;
  status: 'published' | 'draft' | 'archived';
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonExercise {
  title: string;
  difficulty: DifficultyLevel;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: { input: string; expectedOutput: string }[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  // 19-point lesson structure
  objectives: string[];
  conceptExplanation: string;
  analogy?: string;
  whyItMatters?: string;
  syntaxGuide: string;
  basicExample?: {
    code: string;
    explanation: string;
    output: string;
  };
  practicalExample?: {
    code: string;
    explanation: string;
    output: string;
  };
  stepByStepCode: { step: number; description: string; code: string }[];
  runnableExample: {
    language: 'python' | 'sql';
    code: string;
    expectedOutput: string;
  };
  howToRun?: string;
  commonMistakes: { mistake: string; fix: string }[];
  exercise: LessonExercise;
  quiz: LessonQuiz;
  summaryKeyTakeaways?: string[];
  prerequisites: string[];
  relatedLessons?: { title: string; courseSlug: string; lessonSlug: string }[];
  furtherReading?: { title: string; url: string }[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  estimatedHours?: number;
  lessons: Lesson[];
}

export type SubjectTrack =
  | 'python'
  | 'sql'
  | 'dsa'
  | 'data-analytics'
  | 'math-stats'
  | 'ml'
  | 'deep-learning'
  | 'nlp'
  | 'llms'
  | 'generative-ai'
  | 'rag'
  | 'agentic-ai'
  | 'ai-deployment';

export interface CourseProject {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  technologies: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  subject: SubjectTrack | string;
  difficulty: DifficultyLevel;
  iconName: string;
  coverImage: string;
  estimatedHours: number;
  learningPath: string;
  whatYouWillLearn: string[];
  prerequisites: string[];
  requiredTools: string[];
  stages: {
    name: string;
    level: DifficultyLevel;
    description: string;
    focusModules: string[];
  }[];
  recommendedProjects: CourseProject[];
  modules: Module[];
}

export interface PracticeProblem {
  id: string;
  slug: string;
  title: string;
  category: 'python' | 'sql';
  difficulty: DifficultyLevel;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: {
    input: string;
    expectedOutput: string;
    hidden?: boolean;
  }[];
  sqlSchema?: string;
  sqlSeedData?: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'multi-select' | 'output-prediction';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface TopicQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimitSeconds: number;
  xpReward: number;
  badgeName?: string;
  questions: QuizQuestion[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'member' | 'admin' | 'author';
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  solvedProblemIds: string[];
  bookmarkedArticleIds: string[];
  quizScores: { quizId: string; score: number; maxScore: number; date: string }[];
  badges: Badge[];
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'blog'; category?: ArticleCategory; tag?: string }
  | { type: 'article'; slug: string }
  | { type: 'tutorials'; subject?: string }
  | { type: 'course'; courseSlug: string }
  | { type: 'lesson'; courseSlug: string; lessonSlug: string }
  | { type: 'practice'; problemSlug?: string; mode?: 'python' | 'sql' }
  | { type: 'quizzes'; quizId?: string }
  | { type: 'search'; query?: string }
  | { type: 'dashboard' }
  | { type: 'admin' }
  | { type: 'architecture' }
  | { type: 'static'; page: 'about' | 'editorial' | 'privacy' | 'terms' | 'contact' | 'sitemap' | 'seo-checklist' };
