import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import { ErrorBoundary } from '@/components/error-boundary';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import OpenSourceSection from '@/components/sections/OpenSourceSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import ContactSection from '@/components/sections/ContactSection';
import FooterSection from '@/components/sections/FooterSection';
import NotFound from '@/pages/not-found';
import { scrollToId } from '@/lib/scroll';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const RESUME_PATH = import.meta.env.VITE_RESUME_PATH || '/resume.pdf';

const PortfolioPageContent: React.FC = () => {
  const [resumeAvailable, setResumeAvailable] = useState(false);

  // Deterministic in-page anchor scrolling: native fragment navigation races
  // with framer-motion's layout-measurement scroll restores and the mobile
  // menu's exit animation, silently dropping the scroll mid-flight.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')!.slice(1);
      if (!scrollToId(id)) return;
      event.preventDefault();
      if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    let active = true;
    fetch(RESUME_PATH, { method: 'HEAD' })
      .then((response) => {
        const contentType = response.headers.get('content-type') ?? '';
        if (active) setResumeAvailable(response.ok && contentType.includes('application/pdf'));
      })
      .catch(() => {
        if (active) setResumeAvailable(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grain min-h-[100dvh] overflow-x-clip">
      <CustomCursor />
      <Navigation resumeAvailable={resumeAvailable} />
      <main>
        <HeroSection resumeAvailable={resumeAvailable} />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <OpenSourceSection />
        <AchievementsSection />
        <ContactSection resumeAvailable={resumeAvailable} />
      </main>
      <FooterSection resumeAvailable={resumeAvailable} />
    </div>
  );
};

function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={PortfolioPageContent} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

export default function PortfolioPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
