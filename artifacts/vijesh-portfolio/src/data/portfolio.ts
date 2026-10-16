export type ProjectCategory = 'All' | 'Full-Stack' | 'AI / ML' | 'Cloud & DevOps' | 'Hackathon' | 'Open Source';

export type Project = {
  id: string;
  title: string;
  kicker: string;
  category: Exclude<ProjectCategory, 'All'>;
  categories?: Exclude<ProjectCategory, 'All'>[];
  summary: string;
  detail: string;
  status: 'Open source' | 'Private Repository';
  tags: string[];
  accent: string;
  github?: string;
  architecture?: string[];
  contribution?: string;
  result?: string;
  resultNote?: string;
};

export const portfolio = {
  name: 'Vijesh S',
  role: 'Software Engineer & Full-Stack Developer',
  secondary: 'Cloud & DevOps | Solving Real Problems',
  eyebrow: 'B.Tech Artificial Intelligence & Data Science',
  intro:
    'I build full-stack applications, AI-powered systems, and cloud-ready solutions focused on solving practical problems.',
  about:
    'I’m Vijesh S, a B.Tech Artificial Intelligence & Data Science student at KGiSL Institute of Technology, focused on software engineering, full-stack development, cloud, DevOps, and applied AI. I enjoy turning real-world problems into working software—from AI-powered waste segregation and intelligent developer platforms to data-driven systems. Through projects, hackathons, internships, and team-based development, I have worked across frontend, backend, databases, APIs, machine learning, and deployment workflows.',
  location: 'Tamil Nadu, India · Open to remote',
  email: 'viju7122006@gmail.com',
  phone: '9384596466',
  github: 'https://github.com/Vijesh-CDmaster',
  leetcode: 'https://leetcode.com/u/VIjesh_07/',
  linkedin: 'https://www.linkedin.com/in/vijesh-s-b476a3340',
  /** Drop your real photo at this path (public/images/vijesh-profile.png). */
  profileImage: '/images/vijesh-profile.png',
  /** GitHub username used for the public repositories API (no tokens). */
  githubUser: 'Vijesh-CDmaster',
  contactHeadline: "LET'S BUILD SOMETHING USEFUL.",
  /** Open-to-work signal — the first thing recruiters filter on. */
  availability: 'Open to internships — remote or anywhere in Tamil Nadu.',
  stats: [
    { value: '2028', label: 'Expected graduation' },
    { value: '7.83', label: 'Current CGPA' },
    { value: '5+', label: 'Contest-based hiring hackathons' },
    { value: 'Open source', label: 'Contributor' },
  ],
  education: {
    school: 'KGiSL Institute of Technology',
    degree: 'B.Tech Artificial Intelligence & Data Science',
    period: '2024–2028',
    cgpa: '7.83',
  },
  experience: {
    organization: 'Sangam Soft Solutions',
    role: 'Data Science Intern',
    period: '09 June 2026 – 25 June 2026',
    project: 'Silent Dropout Prediction',
    note: 'Patient dropout prediction — not student dropout prediction.',
  },
  openSource: [
    { name: 'CNCF Automation', organization: 'CNCF ecosystem', role: 'Contributor', url: 'https://www.cncf.io/' },
    { name: 'Meshery', organization: 'Meshery', role: 'Contributor', url: 'https://meshery.io/' },
  ],
  hackathons: ['11:11 Hackathon — Yuvaasoft', 'SRCAS 24-hour Hackathon', 'Hackspora', 'Smart India Hackathon', 'INNO HACK', 'AI in Healthcare', 'AURELION', 'PyExpo'],
  projects: [
    {
      id: 'verya',
      title: 'Verya',
      kicker: 'Flagship build / product engineering',
      category: 'Full-Stack',
      categories: ['Full-Stack'],
      summary: 'AI Governance & Orchestration Platform.',
      detail:
        'Verya is a governance and orchestration layer over existing AI infrastructure—not a foundation model. It brings together a Smart AI Router, organization-specific memory, an AI Trust Ledger, explainable confidence, model/tool orchestration, auditability, and outcome-based learning.',
      status: 'Private Repository',
      tags: ['AI governance', 'Orchestration', 'Auditability'],
      accent: 'amber',
      architecture: ['User', 'Verya Control Layer', 'Model / AI Tool Selection', 'Execution', 'Outcome', 'Trust / Feedback / Memory'],
      contribution: 'Designed the product direction and system experience around explainable, governed AI execution.',
    },
    {
      id: 'devlense',
      title: 'DevLense',
      kicker: 'Developer tooling / applied intelligence',
      category: 'AI / ML',
      categories: ['AI / ML', 'Full-Stack'],
      summary: 'Developer Intelligence & Productivity Platform.',
      detail:
        'DevLense is a developer intelligence platform for productivity, engineering analytics, GitHub and Slack integrations, data visualization, dashboards, automated workflows, and developer intelligence.',
      status: 'Private Repository',
      tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Recharts', 'D3', 'Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'asyncpg', 'GitHub API', 'Slack Bot API'],
      accent: 'teal',
    },
    {
      id: 'ecosort',
      title: 'EcoSort-Vision',
      kicker: 'Computer vision / real-world application',
      category: 'AI / ML',
      categories: ['AI / ML', 'Hackathon'],
      summary: 'AI + IoT Waste Segregation & Recycling Platform.',
      detail:
        'EcoSort-Vision connects AI waste detection, automated segregation, IoT/hardware integration, analytics, a recycling marketplace, organic waste processing, plastic recycling, and metal separation into one real-world workflow.',
      status: 'Private Repository',
      tags: ['Computer vision', 'IoT', 'Recycling', 'Analytics', 'Marketplace'],
      accent: 'coral',
      architecture: ['Waste Input', 'AI Detection', 'Primary Segregation', 'Magnetic Separation', 'Eddy Current Separation', 'Organic Processing', 'Recycling / Marketplace'],
      result: '11:11 Hackathon — 2nd Prize',
      resultNote: 'Conducted by Yuvaasoft at Sri Ramakrishna College of Engineering and Technology',
    },
    {
      id: 'temple',
      title: 'Temple',
      kicker: 'Full-stack / community experience',
      category: 'Full-Stack',
      categories: ['Full-Stack'],
      summary: 'AI-Powered Temple Crowd Management System.',
      detail:
        'Temple brings together live crowd monitoring, a virtual queue, crowd prediction, a staff dashboard, emergency alerts, parking management, and analytics for temple operations.',
      status: 'Private Repository',
      tags: ['Crowd monitoring', 'Virtual queue', 'Prediction', 'Analytics'],
      accent: 'violet',
    },
    {
      id: 'aurelion-grid',
      title: 'AURELION / Grid',
      kicker: 'Cloud & DevOps / systems thinking',
      category: 'Cloud & DevOps',
      categories: ['Cloud & DevOps'],
      summary: 'Smart Energy Analytics Platform.',
      detail:
        'AURELION / Grid is a smart energy analytics platform for energy monitoring, usage analytics, data visualization, intelligent analysis, and data-driven decisions.',
      status: 'Private Repository',
      tags: ['Energy monitoring', 'Usage analytics', 'Data visualization', 'Dashboard'],
      accent: 'blue',
    },
    {
      id: 'silent-dropout',
      title: 'Silent Dropout Prediction',
      kicker: 'Data science / human-centered AI',
      category: 'AI / ML',
      categories: ['AI / ML'],
      summary: 'Internship project: predicting patient dropout from treatment data.',
      detail:
        'Silent Dropout Prediction was built during a 15-day data science internship at Sangam Soft Solutions. The work covered cleaning and exploring patient records, training and evaluating predictive models for dropout risk, and packaging the findings into a summary dashboard — with the goal of flagging patients disengaging from treatment early enough for a care team to act.',
      status: 'Private Repository',
      tags: ['Internship', 'Data science', 'EDA', 'Predictive modeling', 'Dashboard'],
      accent: 'gold',
      contribution:
        'Worked the full pipeline: data cleaning and exploratory analysis, model training and evaluation, and a final dashboard presenting the dropout-risk findings.',
      result: 'Completed a 15-day Data Science internship (June 2026).',
    },
  ] satisfies Project[],
  skills: [
    { label: 'Languages', items: ['Python', 'JavaScript', 'TypeScript'] },
    { label: 'Frontend', items: ['React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Vite'] },
    { label: 'Backend', items: ['Node.js', 'Express.js', 'Flask'] },
    { label: 'Databases', items: ['MongoDB', 'PostgreSQL', 'Supabase'] },
    { label: 'AI / ML', items: ['Machine Learning', 'Computer Vision', 'AI APIs', 'Data Analysis'] },
    { label: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Terraform', 'GitHub Actions', 'Linux', 'CI/CD'] },
    { label: 'Tools', items: ['Git', 'GitHub', 'REST APIs', 'JWT'] },
  ],
  achievements: [
    '2nd Prize — 11:11 Hackathon (Yuvaasoft), 3-member team.',
    'Participated in 5+ contest-based hiring hackathons.',
    '15-day Data Science internship at Sangam Soft Solutions — patient dropout prediction.',
    'CNCF & Meshery open-source contributor.',
  ],
};

export const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Open Source', href: '#open-source' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];