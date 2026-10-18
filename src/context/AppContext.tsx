import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  Course,
  PracticeProblem,
  TopicQuiz,
  UserProfile,
  ViewState,
} from '../types';
import { initialArticles, authors } from '../data/seedData';
import { initialCourses } from '../data/courseData';
import { initialPracticeProblems } from '../data/practiceData';
import { initialQuizzes, allBadges } from '../data/quizData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'xp';
}

interface AppContextType {
  view: ViewState;
  navigate: (view: ViewState) => void;
  articles: Article[];
  courses: Course[];
  practiceProblems: PracticeProblem[];
  quizzes: TopicQuiz[];
  user: UserProfile;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'xp') => void;
  toggleBookmark: (articleId: string) => void;
  completeLesson: (lessonId: string, xp?: number) => void;
  solveProblem: (problemId: string, xp?: number) => void;
  submitQuizScore: (quizId: string, score: number, maxScore: number, xp: number, badgeId?: string) => void;
  createArticle: (article: Omit<Article, 'id' | 'views' | 'likes'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
}

const defaultUser: UserProfile = {
  id: 'usr-default',
  name: 'Alex Rivera',
  email: 'alex.rivera@padhowithus.dev',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
  role: 'admin',
  xp: 420,
  level: 3,
  streakDays: 5,
  lastActiveDate: '2026-10-17',
  completedLessonIds: ['les-py-generators'],
  solvedProblemIds: ['prob-py-1'],
  bookmarkedArticleIds: ['art-1', 'art-2'],
  quizScores: [
    { quizId: 'quiz-sql-performance', score: 75, maxScore: 100, date: '2026-10-15' },
  ],
  badges: [allBadges[0], allBadges[3]],
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>(() => {
    // Check URL query or default to home
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/article/')) {
      return { type: 'article', slug: hash.replace('/article/', '') };
    }
    if (hash === '/practice') return { type: 'practice' };
    if (hash === '/tutorials') return { type: 'tutorials' };
    if (hash === '/blog') return { type: 'blog' };
    if (hash === '/quizzes') return { type: 'quizzes' };
    if (hash === '/dashboard') return { type: 'dashboard' };
    if (hash === '/admin') return { type: 'admin' };
    if (hash === '/architecture') return { type: 'architecture' };
    return { type: 'home' };
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('meridian_articles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialArticles;
      }
    }
    return initialArticles;
  });

  const [courses] = useState<Course[]>(initialCourses);
  const [practiceProblems] = useState<PracticeProblem[]>(initialPracticeProblems);
  const [quizzes] = useState<TopicQuiz[]>(initialQuizzes);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('meridian_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  // Persist articles
  useEffect(() => {
    localStorage.setItem('meridian_articles', JSON.stringify(articles));
  }, [articles]);

  // Persist user
  useEffect(() => {
    localStorage.setItem('meridian_user', JSON.stringify(user));
  }, [user]);

  // Sync hash routing smoothly
  const navigate = (nextView: ViewState) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let hash = '';
    switch (nextView.type) {
      case 'home': hash = ''; break;
      case 'blog': hash = '/blog'; break;
      case 'article': hash = `/article/${nextView.slug}`; break;
      case 'tutorials': hash = '/tutorials'; break;
      case 'course': hash = `/course/${nextView.courseSlug}`; break;
      case 'lesson': hash = `/course/${nextView.courseSlug}/${nextView.lessonSlug}`; break;
      case 'practice': hash = '/practice'; break;
      case 'quizzes': hash = '/quizzes'; break;
      case 'search': hash = `/search?q=${encodeURIComponent(nextView.query || '')}`; break;
      case 'dashboard': hash = '/dashboard'; break;
      case 'admin': hash = '/admin'; break;
      case 'architecture': hash = '/architecture'; break;
      case 'static': hash = `/${nextView.page}`; break;
    }
    window.location.hash = hash;
  };

  const showToast = (message: string, type: 'success' | 'info' | 'xp' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleBookmark = (articleId: string) => {
    setUser((prev) => {
      const isBookmarked = prev.bookmarkedArticleIds.includes(articleId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarkedArticleIds.filter((id) => id !== articleId)
        : [...prev.bookmarkedArticleIds, articleId];

      showToast(isBookmarked ? 'Article removed from bookmarks' : 'Article saved to reading list', 'info');
      return { ...prev, bookmarkedArticleIds: nextBookmarks };
    });
  };

  const completeLesson = (lessonId: string, xpGain = 50) => {
    setUser((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) {
        showToast('Lesson already completed!', 'info');
        return prev;
      }
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 200) + 1;
      showToast(`+${xpGain} XP! Lesson Completed Successfully.`, 'xp');
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  };

  const solveProblem = (problemId: string, xpGain = 75) => {
    setUser((prev) => {
      const alreadySolved = prev.solvedProblemIds.includes(problemId);
      if (alreadySolved) {
        showToast('Problem re-verified!', 'info');
        return prev;
      }
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 200) + 1;
      
      // Check first query badge
      let nextBadges = [...prev.badges];
      if (problemId.startsWith('prob-sql') && !nextBadges.some((b) => b.id === 'badge-first-query')) {
        nextBadges.push(allBadges[0]);
        showToast('Badge Unlocked: Query Crafter!', 'success');
      }

      showToast(`+${xpGain} XP! Challenge Solved & Tests Passed!`, 'xp');
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        solvedProblemIds: [...prev.solvedProblemIds, problemId],
        badges: nextBadges,
      };
    });
  };

  const submitQuizScore = (quizId: string, score: number, maxScore: number, xpGain: number, badgeId?: string) => {
    setUser((prev) => {
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 200) + 1;
      let nextBadges = [...prev.badges];

      if (badgeId && !nextBadges.some((b) => b.id === badgeId)) {
        const found = allBadges.find((b) => b.id === badgeId);
        if (found) {
          nextBadges.push(found);
          showToast(`Achievement Unlocked: ${found.name}!`, 'success');
        }
      }

      showToast(`Quiz completed! You scored ${score}/${maxScore} (+${xpGain} XP)`, 'xp');

      const existingIndex = prev.quizScores.findIndex((q) => q.quizId === quizId);
      let updatedScores = [...prev.quizScores];
      if (existingIndex >= 0) {
        updatedScores[existingIndex] = {
          quizId,
          score: Math.max(score, updatedScores[existingIndex].score),
          maxScore,
          date: new Date().toISOString().split('T')[0],
        };
      } else {
        updatedScores.push({
          quizId,
          score,
          maxScore,
          date: new Date().toISOString().split('T')[0],
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        quizScores: updatedScores,
        badges: nextBadges,
      };
    });
  };

  const createArticle = (articleData: Omit<Article, 'id' | 'views' | 'likes'>) => {
    const newArticle: Article = {
      ...articleData,
      id: `art-${Date.now()}`,
      views: 1,
      likes: 0,
      author: articleData.author || authors[0],
    };
    setArticles((prev) => [newArticle, ...prev]);
    showToast('Article published successfully!', 'success');
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : a))
    );
    showToast('Article updated.', 'success');
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Article removed.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        view,
        navigate,
        articles,
        courses,
        practiceProblems,
        quizzes,
        user,
        toasts,
        showToast,
        toggleBookmark,
        completeLesson,
        solveProblem,
        submitQuizScore,
        createArticle,
        updateArticle,
        deleteArticle,
        searchFilter,
        setSearchFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
