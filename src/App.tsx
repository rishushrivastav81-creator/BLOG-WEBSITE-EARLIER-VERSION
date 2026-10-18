import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { HomeView } from './components/views/HomeView';
import { BlogView } from './components/views/BlogView';
import { ArticleDetailView } from './components/views/ArticleDetailView';
import { TutorialsView } from './components/views/TutorialsView';
import { CourseOverviewView } from './components/views/CourseOverviewView';
import { LessonDetailView } from './components/views/LessonDetailView';
import { PracticeView } from './components/views/PracticeView';
import { QuizView } from './components/views/QuizView';
import { DashboardView } from './components/views/DashboardView';
import { AdminView } from './components/views/AdminView';
import { SearchView } from './components/views/SearchView';
import { StaticPagesView } from './components/views/StaticPagesView';
import { ArchitectureDocsView } from './components/views/ArchitectureDocsView';

const MainRouter: React.FC = () => {
  const { view } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-slate-900">
      <Header />

      <main className="flex-1">
        {view.type === 'home' && <HomeView />}
        {view.type === 'blog' && <BlogView initialCategory={view.category} initialTag={view.tag} />}
        {view.type === 'article' && <ArticleDetailView slug={view.slug} />}
        {view.type === 'tutorials' && <TutorialsView initialSubject={view.subject} />}
        {view.type === 'course' && <CourseOverviewView courseSlug={view.courseSlug} />}
        {view.type === 'lesson' && <LessonDetailView courseSlug={view.courseSlug} lessonSlug={view.lessonSlug} />}
        {view.type === 'practice' && <PracticeView initialProblemSlug={view.problemSlug} initialMode={view.mode} />}
        {view.type === 'quizzes' && <QuizView initialQuizId={view.quizId} />}
        {view.type === 'search' && <SearchView initialQuery={view.query} />}
        {view.type === 'dashboard' && <DashboardView />}
        {view.type === 'admin' && <AdminView />}
        {view.type === 'architecture' && <ArchitectureDocsView />}
        {view.type === 'static' && <StaticPagesView page={view.page} />}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
