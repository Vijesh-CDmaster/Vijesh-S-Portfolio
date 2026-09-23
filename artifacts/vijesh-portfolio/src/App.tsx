import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import { About, Achievements, Contact, Footer, Header, Hero, Journey, Projects, Reveal, Skills } from '@/components/portfolio';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const RESUME_PATH = import.meta.env.VITE_RESUME_PATH || '/resume.pdf';

function PortfolioPage() {
  const [resumeAvailable, setResumeAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(RESUME_PATH, { method: 'HEAD' })
      .then((response) => {
        const contentType = response.headers.get('content-type') ?? '';
        if (active) setResumeAvailable(response.ok && contentType.includes('application/pdf'));
      })
      .catch(() => { if (active) setResumeAvailable(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="grain min-h-[100dvh] overflow-x-clip">
      <Header resumeAvailable={resumeAvailable} />
      <main>
        <Hero resumeAvailable={resumeAvailable} />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Journey />
        <Contact />
        <Reveal><div className="section-shell pb-24 md:pb-32"><div className="hairline" /></div></Reveal>
      </main>
      <Footer resumeAvailable={resumeAvailable} />
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={PortfolioPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
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

export default App;