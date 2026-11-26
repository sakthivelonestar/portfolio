/* ==========================================================================
   SakthiOS — window manager, desktop, dock and apps (vanilla JS, no libraries)
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const sysReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduced = () => sysReduce || root.classList.contains('reduce-motion');
  const mqMobile = window.matchMedia('(max-width: 760px)');
  let isMobile = mqMobile.matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
  const MOD = isMac ? '⌘' : 'Ctrl';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const px = (r) => ({ left: `${Math.round(r.left)}px`, top: `${Math.round(r.top)}px`, width: `${Math.round(r.width)}px`, height: `${Math.round(r.height)}px` });
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  /* ======================================================================
     Content
     ====================================================================== */
  const PROFILE = {
    name: 'Sakthivel',
    email: 'sakthivelidn@gmail.com',
    phone: '+91 63748 57173',
    phoneHref: 'tel:+916374857173',
    linkedin: 'https://www.linkedin.com/in/sakthi-vel-41634021a/',
    github: 'https://github.com/sakthivelonestar',
    resume: 'sakthivel_fullstackdeveloper.pdf',
  };

  const G = {
    sparkle: '<path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7z"/><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    folder: '<path d="M3 7.5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    git: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.2v9.6M18 10.2c0 4.2-6 3.4-11 6.6"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    terminal: '<path d="m5 8 4 4-4 4M12 17h7"/>',
    mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/>',
    pdf: '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5M8.5 13h7M8.5 17h5"/>',
    cap: '<path d="M22 9.5 12 4.5 2 9.5l10 5 10-5z"/><path d="M6 11.5v5c3 2 9 2 12 0v-5M22 9.5v5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    trash: '<path d="M3.5 6.5h17M9 6.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 6.5l1 13a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8l1-13M10 11v6M14 11v6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pulse: '<path d="M2 12h4l3-8 6 16 3-8h4"/>',
    wave: '<path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 10v4"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    file: '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    ext: '<path d="M7 17 17 7M8 7h9v9"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    power: '<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    award: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21l4-3 4 3M8 9h8M8 12h5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    tile: '<rect x="3" y="3" width="8" height="18" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  };
  const svg = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${G[name] || ''}</svg>`;

  const PROJECTS = [
    {
      title: 'AI Healthcare Platform', org: 'VA Meditek', year: '2026', period: 'Feb 2026 – Oct 2026',
      role: 'Full Stack Developer', icon: 'pulse', hue: 172,
      summary: 'Doctor consultations, lab tests, medicines and emergency help, with a multilingual AI care assistant, in one platform.',
      features: [
        'Built patient, doctor, lab-partner and admin portals on a single NestJS backend.',
        'Developed video consultations and a real-time token queue with Socket.IO.',
        'Built a multilingual AI care assistant with Python-based intent detection, safety checks and an LLM fallback.',
        'Added AI report explanations, emergency help with nearby hospitals on maps, and ambulance booking.',
        'Integrated online payments, OTP sign-in, push notifications, cloud file storage and PDF generation.',
        'Deployed on a Linux VPS: the web app, API and AI engine run as separate services, with PM2 auto-restart and a memory guard, and server time pinned to India time for correct appointment slots.',
      ],
      stack: ['Angular SSR', 'PrimeNG', 'NestJS', 'PostgreSQL', 'Socket.IO', 'Python', 'FastAPI', 'AI APIs', 'Linux VPS', 'Nginx', 'PM2'],
    },
    {
      title: 'AI Speech-Practice App', org: 'VA Meditek', year: '2026', period: 'Nov 2026 – Present',
      role: 'Full Stack Developer', icon: 'wave', hue: 196,
      summary: 'AI-guided daily speech practice for adults and kids, with progress tracking and caregiver support.',
      features: [
        "Built daily practice sessions, reading exercises, progress tracking and a kids' area with stories and games.",
        'Integrated AI to generate personalised practice content, with fallbacks when the model is slow.',
        'Added safety checks on every AI reply, plus speech-to-text and text-to-speech.',
        'Built the REST API with Express, TypeORM and PostgreSQL, with role-based access, JWT and Swagger docs.',
        'Deployed to production on a Linux VPS behind Nginx with HTTPS.',
      ],
      stack: ['Angular SSR', 'PrimeNG', 'Express', 'TypeORM', 'PostgreSQL', 'AI APIs', 'Linux VPS', 'Nginx', 'PM2'],
    },
    {
      title: 'Health Companion App', org: 'VA Meditek', year: '2026', period: 'Nov 2026 – Present',
      role: 'Full Stack Developer', icon: 'heart', hue: 342,
      summary: 'A personal health companion with an AI assistant that answers questions from reviewed content.',
      features: [
        'Building onboarding, a home dashboard, daily logging, personal insights and plans.',
        'Developing an AI assistant that answers from reviewed content, with safety checks before and after the AI.',
        'Built OTP sign-in and consent management for user data.',
        'Created role-based admin consoles for the operations team.',
        'Set up VPS hosting with the API on its own subdomain behind Nginx, HTTPS and secure WebSockets for real-time chat.',
      ],
      stack: ['Angular SSR', 'PrimeNG', 'Express', 'TypeORM', 'PostgreSQL', 'AI APIs', 'Linux VPS', 'Nginx', 'PM2'],
    },
    {
      title: 'Employee Engagement Platform', org: 'Finstein', year: '2023–24', period: 'Aug 2023 – Mar 2024',
      role: 'Lead Developer', icon: 'users', hue: 262,
      summary: 'A multitenant platform for surveys, quizzes and real-time engagement across organisations.',
      features: [
        'Led development of a multitenant app that manages multiple organisations.',
        'Built a responsive Angular web UI and an Angular-Ionic mobile app.',
        'Designed NestJS APIs and a real-time notification system.',
        'Built an admin dashboard for surveys, quizzes and spin-wheel activities, with role-based access for admin and super admin.',
      ],
      stack: ['Angular', 'Angular-Ionic', 'NestJS', 'SQL', 'D3.js'],
    },
    {
      title: 'D3.js Finance Dashboard', org: 'Finstein', year: '2024–25', period: 'Jul 2024 – Feb 2025',
      role: 'Lead Developer', icon: 'chart', hue: 214,
      summary: 'Interactive financial visualisations with bulk Excel upload, data export and PDF reports.',
      features: [
        'Built interactive financial visualisations with D3.js.',
        'Implemented bulk upload of multiple Excel files with skip and replace options.',
        'Added Excel data export and PDF export of the whole dashboard.',
      ],
      stack: ['Angular', 'D3.js', 'NestJS', 'PostgreSQL', 'Firebase'],
    },
    {
      title: 'Campaign Management System', org: 'Finstein · Hackathon', year: '2024', period: '2024',
      role: 'Team Lead', badge: '🏆 Achiever Award', icon: 'mail', hue: 38,
      summary: 'Category-based bulk email scheduling and tracking, built at a company hackathon by a team I led.',
      features: [
        'Led 4 junior developers to build the app during a company hackathon.',
        'Enabled scheduled bulk email sending with category-based targeting: companies, colleagues and custom segments.',
        'Integrated email monitoring to track delivery and engagement.',
        'Won the Achiever Award for performance.',
      ],
      stack: ['Angular', 'NestJS', 'SQL'],
    },
    {
      title: 'Event Management System', org: 'Finstein', year: '2023', period: 'May 2023 – Jul 2023',
      role: 'Full Stack Developer', icon: 'calendar', hue: 12,
      summary: 'A multitenant event platform with an interactive calendar, ticketing and QR check-in.',
      features: [
        'Built a multitenant event platform with an Angular web app and an Angular-Ionic mobile app.',
        'Designed an interactive event calendar with custom filters.',
        'Implemented ticketing, QR scanning and real-time alerts.',
        'Created an admin dashboard with event analytics.',
      ],
      stack: ['Angular', 'Angular-Ionic', 'NestJS', 'SQL', 'D3.js'],
    },
    {
      title: 'Document Management System', org: 'Finstein', year: '2022–23', period: 'Oct 2022 – Apr 2023',
      role: 'Junior Developer', icon: 'file', hue: 232,
      summary: 'Secure document storage with encryption, fast search and role-based approvals.',
      features: [
        'Built secure document storage with encryption.',
        'Implemented advanced search for fast document retrieval.',
        'Designed role-based permissions and approval workflows.',
      ],
      stack: ['Nuxt', 'NestJS', 'SQL', 'Firebase'],
    },
    {
      title: 'LogicPrograms Tutorial', org: 'Personal', year: '2025', period: 'Mar 2025 – Sep 2025',
      role: 'Creator', icon: 'code', hue: 140,
      summary: 'A full stack tutorial website built with Angular, with structured lessons starting from SQL.',
      features: [
        'Designed and built a tutorial site for full stack technologies with Angular 17.',
        'Wrote structured lessons, starting with SQL data types.',
        'Deployed on Netlify.',
      ],
      stack: ['Angular', 'TypeScript', 'HTML', 'CSS'],
      link: { href: 'https://teal-twilight-9546d8.netlify.app/sql/data-types', label: 'Visit live site' },
    },
  ];

  const EXPERIENCE = [
    {
      hash: 'a7f3c21', refs: [['head', 'HEAD → main'], ['branch', 'ai-healthcare']], date: 'Feb 2026 – Present',
      role: 'Full Stack Developer', org: 'VA Meditek Pvt Ltd', place: 'Chennai',
      bullets: [
        'Building <strong>three AI-powered products</strong> in healthcare and wellbeing, from database design to production deployment.',
        'Shipped an <strong>AI healthcare platform</strong> with patient, doctor, lab-partner and admin portals on one NestJS backend.',
        'Integrated <strong>OpenAI, Claude and Gemini APIs</strong> with Python-based AI services, safety checks and multilingual chat.',
        'Delivered real-time queues with Socket.IO, online payments, push notifications and server-side rendered Angular apps.',
        'Deployed and run the apps on a <strong>Linux VPS</strong>: Nginx reverse proxy with HTTPS and secure WebSockets, PM2 process management with auto-restart, and the web app, API and AI engine as separate services.',
      ],
      stack: ['Angular SSR', 'NestJS', 'Express', 'PostgreSQL', 'Python', 'AI APIs', 'VPS', 'Nginx', 'PM2'],
    },
    {
      hash: '4c9e0b8', refs: [['branch', 'side-projects']], date: 'Mar 2025 – Sep 2025',
      role: 'Personal Projects', org: 'Independent', place: 'Salem',
      bullets: [
        'Built <strong>LogicPrograms</strong>, a full stack tutorial site with Angular 17, starting with lessons on SQL.',
        'Created an offline data-visualisation project with D3.js (FDNA – Finance DNA).',
        'Designed and built my first glassmorphism portfolio website.',
      ],
      stack: ['Angular', 'D3.js', 'HTML', 'CSS'],
    },
    {
      hash: 'e21d5f6', refs: [['tag', 'tag: achiever-award']], date: 'Aug 2023 – Mar 2025',
      role: 'Lead Full Stack Developer', org: 'Finstein Technologies Pvt Ltd', place: 'Chennai',
      bullets: [
        'Led the <strong>Employee Engagement Platform</strong>: a multitenant Angular, Angular-Ionic and NestJS app with real-time notifications.',
        'Led a <strong>D3.js finance dashboard</strong> with bulk Excel upload, data export and PDF reports.',
        'Led 4 developers to build a bulk email campaign system at a hackathon and won the <strong>Achiever Award</strong>.',
        'Trained and mentored 3 junior developers in the team.',
      ],
      stack: ['Angular', 'Angular-Ionic', 'NestJS', 'SQL', 'D3.js'],
    },
    {
      hash: '1b08a93', refs: [['tag', 'tag: first-commit']], date: 'Jul 2022 – Jul 2023',
      role: 'Junior Full Stack Developer', org: 'Finstein Technologies Pvt Ltd', place: 'Chennai',
      bullets: [
        'Completed 3 months of full stack training in HTML, CSS, JavaScript, Angular and Node.js.',
        'Built a <strong>multitenant event management system</strong> with calendar tools, ticketing, smart filters and QR scanning.',
        'Developed a <strong>document management system</strong> with encrypted storage, fast search and role-based approvals.',
      ],
      stack: ['Angular', 'Nuxt', 'NestJS', 'SQL', 'Firebase'],
    },
  ];

  const SKILLS = [
    { key: 'frontend', name: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Angular', 'Angular SSR', 'Ionic', 'PrimeNG', 'D3.js', 'Nuxt'] },
    { key: 'backend', name: 'Backend', items: ['Node.js', 'NestJS', 'Express', 'TypeORM', 'REST APIs', 'Socket.IO', 'PostgreSQL', 'SQL', 'JWT'] },
    { key: 'ai', name: 'AI & ML', items: ['OpenAI', 'Claude', 'Gemini', 'Prompt Engineering', 'Python', 'FastAPI', 'scikit-learn'] },
    { key: 'deploy', name: 'Deployment & VPS', items: ['Linux VPS', 'Nginx', 'Reverse Proxy', 'PM2', 'SSL / HTTPS', 'SSH', 'Domains & DNS'] },
    { key: 'tools', name: 'Cloud & Tools', items: ['AWS', 'Google Cloud', 'Firebase', 'Razorpay', 'Git', 'GitHub', 'GitLab', 'VS Code', 'Cursor AI'] },
  ];

  const LOGOS = [['angular.png', 'Angular'], ['nestjs.png', 'NestJS'], ['nodejs.png', 'Node.js'], ['sql.png', 'SQL'], ['d3js.png', 'D3.js'], ['primeng.png', 'PrimeNG'], ['ionic.png', 'Ionic'], ['nuxtjs.png', 'Nuxt'], ['firebase.png', 'Firebase'], ['aws.png', 'AWS'], ['js.png', 'JavaScript'], ['html.png', 'HTML5'], ['css.png', 'CSS3'], ['github.png', 'GitHub'], ['gitlab.png', 'GitLab']];

  const EDUCATION = [
    { year: '2018 — 2022', icon: 'cap', title: 'B.E. Computer Science & Engineering', place: "Narasu's Sarathy Institute of Technology (Anna University), Salem", score: '7.81', small: 'CGPA', wide: true },
    { year: '2021 — 2022', icon: 'award', title: 'Certificate in MEAN Stack Development', place: 'Livewire, Salem', score: 'MEAN', small: 'Mongo · Express · Angular · Node' },
    { year: '2024', icon: 'trophy', title: 'Hackathon Achiever Award', place: 'Finstein Technologies', score: '🏆', small: 'Led a team of 5', award: true },
    { year: '2018', icon: 'book', title: 'Higher Secondary (HSC)', place: 'Govt Boys Higher Secondary School', score: '58', small: '%' },
    { year: '2016', icon: 'book', title: 'Secondary School (SSLC)', place: 'Govt Boys Higher Secondary School', score: '75.4', small: '%' },
  ];

  /* ======================================================================
     Apps registry
     ====================================================================== */
  const APPS = {
    welcome: { label: 'Welcome', title: 'Welcome.md', icon: 'sparkle', bg: 'linear-gradient(135deg,#8ff0df,#ffb9c7)', ink: '#073330', size: [680, 610], render: renderWelcome },
    about: { label: 'About Me', title: 'About Me', icon: 'user', bg: 'linear-gradient(135deg,#a6f6e8,#178a81)', size: [860, 660], render: renderAbout },
    projects: { label: 'Projects', title: 'Projects', icon: 'folder', bg: 'linear-gradient(135deg,#ffe2ad,#ef9a4c)', size: [1010, 640], render: renderProjects },
    experience: { label: 'Experience', title: 'Experience — git log', icon: 'git', bg: 'linear-gradient(135deg,#d6cbff,#7462d8)', size: [780, 680], render: renderExperience },
    skills: { label: 'Skills', title: 'Skills', icon: 'cpu', bg: 'linear-gradient(135deg,#c6f8d5,#2c9a69)', size: [960, 660], render: renderSkills },
    terminal: { label: 'Terminal', title: 'Terminal — zsh', icon: 'terminal', bg: 'linear-gradient(135deg,#21504b,#03110f)', ink: '#8ff0df', size: [760, 500], render: renderTerminal },
    education: { label: 'Education', title: 'Education & Awards', icon: 'cap', bg: 'linear-gradient(135deg,#b3dcff,#4687d4)', size: [760, 600], render: renderEducation },
    resume: { label: 'Resume.pdf', title: 'Resume.pdf', icon: 'pdf', bg: 'linear-gradient(135deg,#ffc6b8,#de5e4a)', size: [780, 860], render: renderResume },
    contact: { label: 'Mail', title: 'Mail — New message', icon: 'mail', bg: 'linear-gradient(135deg,#ffd3dc,#de6a87)', size: [880, 600], render: renderContact },
    settings: { label: 'Settings', title: 'Settings', icon: 'gear', bg: 'linear-gradient(135deg,#e6eeed,#7d9592)', ink: '#123532', size: [660, 660], render: renderSettings },
    trash: { label: 'Trash', title: 'Trash', icon: 'trash', bg: 'linear-gradient(135deg,var(--glass-2),var(--glass))', ink: 'var(--text)', size: [580, 430], render: renderTrash },
  };
  const DESKTOP = ['welcome', 'about', 'projects', 'experience', 'skills', 'terminal', 'education', 'resume', 'contact', 'settings', 'trash'];
  const DOCK = ['about', 'projects', 'experience', 'skills', 'terminal', 'contact', 'resume', 'settings', '|', 'trash'];
  const MDOCK = ['about', 'projects', 'terminal', 'contact'];
  const ALIASES = { me: 'about', aboutme: 'about', project: 'projects', work: 'projects', exp: 'experience', career: 'experience', jobs: 'experience', skill: 'skills', stack: 'skills', mail: 'contact', email: 'contact', hire: 'contact', cv: 'resume', resumepdf: 'resume', edu: 'education', term: 'terminal', shell: 'terminal', readme: 'welcome', home: 'welcome' };

  const appIcon = (key) => {
    const a = APPS[key];
    return `<span class="app-ico" style="--ico-bg:${a.bg};${a.ink ? `--ico-ink:${a.ink};` : ''}">${svg(a.icon, '')}</span>`;
  };
  const projIcon = (p, flag = false) => {
    let f = '';
    if (flag && p.link) f = '<span class="pj-flag">LIVE</span>';
    return `<span class="pj-ico" style="--h:${p.hue}">${svg(p.icon, '')}${f}</span>`;
  };
  const keyOf = (id) => id.split(':')[0];
  // company work is shown by role only: no live demos or links are shared
  const isCompany = (p) => !p.link;
  const PRIVATE_NOTE = 'Company project. The demo and links stay private, so this shows my role and what I built.';

  function appOf(id) {
    const [k, arg] = id.split(':');
    if (k === 'project') {
      const i = Number(arg);
      const p = PROJECTS[i];
      if (!p) return null;
      return { label: p.title, title: p.title, size: [740, 660], iconHTML: projIcon(p), render: (body) => renderProjectDetail(body, i) };
    }
    return APPS[k] || null;
  }

  /* ======================================================================
     Small helpers: theme, toasts, clipboard, confetti
     ====================================================================== */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    store.set('theme', t);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#031c1b' : '#e5f1ef');
    window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
    syncSettings();
  }
  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduced()) { setTheme(next); return; }
    const btn = $('#mbTheme');
    const r = btn.getBoundingClientRect();
    const ok = r.width > 0;
    const x = ok ? r.left + r.width / 2 : innerWidth / 2;
    const y = ok ? r.top + r.height / 2 : innerHeight / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => setTheme(next));
    vt.ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(.7,0,.3,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  }

  const WALLS = ['aurora', 'midnight', 'sunrise'];
  const WALL_META = [
    ['aurora', 'Aurora', 'radial-gradient(120% 90% at 30% 0%, #2a9d92, #062b29 62%, #031c1b)'],
    ['midnight', 'Midnight', 'radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 50% 60%, #fff, transparent), linear-gradient(180deg, #020a12, #1f4f7a)'],
    ['sunrise', 'Sunrise', 'linear-gradient(180deg, #14504c, #a8766d 70%, #ffc9a8)'],
  ];
  const ACCENTS = [['teal', '#8ff0df', 'Teal'], ['rose', '#ffb9c7', 'Rose'], ['amber', '#ffd29b', 'Amber'], ['sky', '#a9d8ff', 'Sky']];
  function setWallpaper(w) { root.setAttribute('data-wallpaper', w); store.set('sos-wallpaper', w); syncSettings(); }
  function cycleWallpaper() {
    const i = WALLS.indexOf(root.getAttribute('data-wallpaper') || 'aurora');
    setWallpaper(WALLS[(i + 1) % WALLS.length]);
  }
  function setAccent(a) {
    if (a === 'teal') root.removeAttribute('data-accent'); else root.setAttribute('data-accent', a);
    store.set('sos-accent', a);
    syncSettings();
  }
  function setReduce(on) { root.classList.toggle('reduce-motion', on); store.set('sos-reduce', on ? '1' : '0'); syncSettings(); }
  function syncSettings() {
    $$('[data-set="theme"] button').forEach((b) => b.classList.toggle('is-on', b.dataset.v === root.getAttribute('data-theme')));
    $$('[data-set="accent"] .swatch').forEach((b) => b.classList.toggle('is-on', b.dataset.v === (root.getAttribute('data-accent') || 'teal')));
    $$('[data-set="wallpaper"] .wp-thumb').forEach((b) => b.classList.toggle('is-on', b.dataset.v === (root.getAttribute('data-wallpaper') || 'aurora')));
    $$('input[data-set="reduce"]').forEach((c) => { c.checked = root.classList.contains('reduce-motion'); });
  }

  function notify({ app = 'welcome', iconHTML, title, body = '', actions = [], timeout = 7000 }) {
    const wrap = $('#notifs');
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `${iconHTML || appIcon(app)}<div><b>${esc(title)}</b>${body ? `<p>${body}</p>` : ''}${actions.length ? `<div class="notif-actions">${actions.map((a, i) => `<button class="btn btn-sm${i === 0 ? ' btn-primary' : ''}" type="button" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}</div><button class="notif-x" type="button" aria-label="Dismiss">${svg('x')}</button>`;
    wrap.appendChild(n);
    const kill = () => {
      if (n.dataset.gone) return;
      n.dataset.gone = '1';
      n.classList.add('is-out');
      setTimeout(() => n.remove(), 320);
    };
    n.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) { actions[Number(b.dataset.i)].run(); kill(); } else if (e.target.closest('.notif-x')) kill();
    });
    if (timeout) {
      let t = setTimeout(kill, timeout);
      n.addEventListener('pointerenter', () => clearTimeout(t));
      n.addEventListener('pointerleave', () => { t = setTimeout(kill, 2500); });
    }
    const all = $$('.notif', wrap);
    if (all.length > 3) all[0].remove();
    return n;
  }

  function copyEmail() {
    const done = () => notify({ app: 'contact', title: 'Email copied', body: esc(PROFILE.email), timeout: 3500 });
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(PROFILE.email).then(done, () => fallbackCopy(done));
    else fallbackCopy(done);
  }
  function fallbackCopy(done) {
    const ta = document.createElement('textarea');
    ta.value = PROFILE.email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
    done();
  }
  function downloadResume() {
    const a = document.createElement('a');
    a.href = PROFILE.resume;
    a.download = PROFILE.resume;
    document.body.appendChild(a);
    a.click();
    a.remove();
    notify({ app: 'resume', title: 'Downloading résumé', body: esc(PROFILE.resume), timeout: 3500 });
  }
  function hireMe() {
    confetti();
    setTimeout(() => openApp('contact'), 500);
  }

  function confetti() {
    if (reduced()) return;
    const cv = $('#confetti');
    const ctx = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ['#8ff0df', '#ffb9c7', '#ffd29b', '#a9d8ff', '#ffffff', '#33c2ae'];
    const parts = Array.from({ length: 150 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 17, vy: -Math.random() * 16 - 6,
      r: Math.random() * 7 + 4, c: colors[(Math.random() * colors.length) | 0], a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3,
    }));
    let f = 0;
    const step = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalAlpha = Math.max(0, 1 - f / 160);
      for (const p of parts) {
        p.vy += 0.4; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore();
      }
      if (++f < 160) requestAnimationFrame(step); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    step();
  }

  function countUp(scope) {
    $$('[data-count]', scope).forEach((el) => {
      const to = parseFloat(el.dataset.count);
      const dec = Number(el.dataset.dec || 0);
      if (reduced()) { el.textContent = to.toFixed(dec); return; }
      const t0 = performance.now();
      const dur = 1300;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ======================================================================
     Window manager
     ====================================================================== */
  const WM = { wins: new Map(), z: 20, focused: null, cascade: 0 };
  const layer = $('#windows');
  const DOCK_RESERVE = 86;
  const mbH = () => $('#menubar').offsetHeight || 30;
  const workArea = () => {
    const top = mbH();
    return { x: 0, y: top, w: innerWidth, h: innerHeight - top - (isMobile ? 0 : DOCK_RESERVE) };
  };
  const widgetsShown = () => {
    const w = $('.widgets');
    return !isMobile && w && getComputedStyle(w).display !== 'none';
  };
  const rectOf = (el) => ({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });

  function openApp(id, opts = {}) {
    const app = appOf(id);
    if (!app) return null;
    const existing = WM.wins.get(id);
    if (existing) {
      if (existing.min) restore(id); else focus(id);
      return existing;
    }
    closeMenu();
    const el = document.createElement('section');
    el.className = 'win';
    el.dataset.id = id;
    el.dataset.app = keyOf(id);
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', app.title);
    el.tabIndex = -1;
    el.innerHTML = `
      <header class="win-bar">
        <div class="win-ctrls">
          <button class="wc wc-close" type="button" aria-label="Close ${esc(app.label)}"><svg viewBox="0 0 10 10"><path d="M2.6 2.6l4.8 4.8M7.4 2.6 2.6 7.4"/></svg></button>
          <button class="wc wc-min" type="button" aria-label="Minimise ${esc(app.label)}"><svg viewBox="0 0 10 10"><path d="M2.2 5h5.6"/></svg></button>
          <button class="wc wc-max" type="button" aria-label="Maximise ${esc(app.label)}"><svg viewBox="0 0 10 10"><path d="M2.4 5h5.2M5 2.4v5.2"/></svg></button>
        </div>
        <button class="win-back" type="button" aria-label="Back to home screen">${svg('back')}Home</button>
        <div class="win-title">${app.iconHTML || appIcon(keyOf(id))}<span>${esc(app.title)}</span></div>
        <div class="win-extra"></div>
      </header>
      <div class="win-body"></div>
      <span class="win-resize" aria-hidden="true"></span>`;
    const win = { id, app, el, body: $('.win-body', el), min: false, max: false, snapped: false, prev: null, cleanup: [] };
    WM.wins.set(id, win);
    layer.appendChild(el);
    place(win);
    try { app.render(win.body, win, opts); } catch (err) {
      console.error(err);
      win.body.innerHTML = '<p class="app-pad">Something went wrong while opening this app.</p>';
    }
    wireWindow(win);
    focus(id);
    animateIn(win, opts.origin);
    bounce(id);
    syncChrome();
    if (!isMobile) el.focus({ preventScroll: true });
    return win;
  }

  function place(win) {
    if (isMobile) return;
    if (WM.wins.size <= 1) WM.cascade = 0;
    const A = workArea();
    const [pw, ph] = win.app.size;
    const w = Math.min(pw, A.w - 40);
    const h = Math.min(ph, A.h - 24);
    const free = widgetsShown() ? A.w - 300 : A.w;
    const off = (WM.cascade++ % 7) * 28;
    let x = (free - w) / 2 + off;
    if (free - w > 230) x = Math.max(x, 120); // keep the desktop icons visible when there is room
    x = clamp(x, 12, A.w - w - 12);
    const y = A.y + clamp((A.h - h) / 2 - 8 + off, 10, Math.max(10, A.h - h));
    Object.assign(win.el.style, px({ left: x, top: y, width: w, height: h }));
  }

  function wireWindow(win) {
    const { el, id } = win;
    const bar = $('.win-bar', el);
    el.addEventListener('pointerdown', () => focus(id), true);
    $('.wc-close', el).addEventListener('click', () => closeWin(id));
    $('.wc-min', el).addEventListener('click', () => minimize(id));
    $('.wc-max', el).addEventListener('click', () => toggleMax(id));
    $('.win-back', el).addEventListener('click', () => minimize(id));
    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button, input') && !isMobile) toggleMax(id); });
    bar.addEventListener('pointerdown', (e) => startMove(e, win));
    $('.win-resize', el).addEventListener('pointerdown', (e) => startResize(e, win));
  }

  function focus(id) {
    const win = WM.wins.get(id);
    if (!win) return;
    if (WM.focused !== id || !win.el.style.zIndex) win.el.style.zIndex = String(++WM.z);
    WM.wins.forEach((w) => w.el.classList.toggle('is-focused', w.id === id));
    WM.focused = id;
    $('#mbApp').textContent = win.app.label;
  }
  function focusTop() {
    let best = null;
    WM.wins.forEach((w) => { if (!w.min && (!best || Number(w.el.style.zIndex) > Number(best.el.style.zIndex))) best = w; });
    if (best) { focus(best.id); return; }
    WM.focused = null;
    WM.wins.forEach((w) => w.el.classList.remove('is-focused'));
    $('#mbApp').textContent = 'Desktop';
  }

  function originRect(origin) {
    if (!origin || !origin.getBoundingClientRect) return null;
    const ico = origin.querySelector ? origin.querySelector('.app-ico, .pj-ico') : null;
    const r = (ico || origin).getBoundingClientRect();
    return r.width ? r : null;
  }
  function animateIn(win, origin) {
    if (reduced()) return;
    const r = win.el.getBoundingClientRect();
    const o = originRect(origin);
    let from = { transform: 'translateY(16px) scale(.94)', opacity: 0 };
    if (o) {
      const dx = (o.left + o.width / 2) - (r.left + r.width / 2);
      const dy = (o.top + o.height / 2) - (r.top + r.height / 2);
      const s = clamp(o.width / r.width, 0.06, 0.4);
      from = { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0 };
    }
    win.el.animate([from, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
  }

  function closeWin(id) {
    const win = WM.wins.get(id);
    if (!win) return;
    WM.wins.delete(id);
    win.cleanup.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
    const remove = () => win.el.remove();
    if (reduced() || win.min) remove();
    else win.el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.94)' }], { duration: 180, easing: 'ease-in', fill: 'forwards' }).finished.then(remove, remove);
    if (WM.focused === id) focusTop();
    syncChrome();
  }

  function dockTarget(id) {
    const key = keyOf(id) === 'project' ? 'projects' : keyOf(id);
    const visible = (el) => el && el.offsetParent !== null && el.getBoundingClientRect().top < innerHeight;
    let t = $(`.dock-item[data-app="${key}"]`);
    if (isMobile || !visible(t)) {
      const ic = $(`.d-icon[data-app="${key}"]`);
      if (visible(ic)) t = ic;
    }
    if (!visible(t)) t = $('.dock');
    const r = t.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function toDock(el, t) {
    const r = el.getBoundingClientRect();
    return `translate(${t.x - (r.left + r.width / 2)}px, ${t.y - (r.top + r.height / 2)}px) scale(.05)`;
  }

  function minimize(id) {
    const win = WM.wins.get(id);
    if (!win || win.min) return;
    win.min = true;
    const el = win.el;
    if (reduced()) el.hidden = true;
    else {
      const anim = el.animate([{ transform: 'none', opacity: 1 }, { transform: toDock(el, dockTarget(id)), opacity: 0.2 }], { duration: 430, easing: 'cubic-bezier(.55,0,.8,.3)', fill: 'forwards' });
      win.anim = anim;
      anim.finished.then(() => { if (win.min) el.hidden = true; anim.cancel(); }, () => {});
    }
    if (WM.focused === id) focusTop();
    syncChrome();
  }
  function restore(id) {
    const win = WM.wins.get(id);
    if (!win) return;
    if (!win.min) { focus(id); return; }
    if (win.anim) { win.anim.cancel(); win.anim = null; }
    win.min = false;
    win.el.hidden = false;
    focus(id);
    if (!reduced()) win.el.animate([{ transform: toDock(win.el, dockTarget(id)), opacity: 0.2 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
    syncChrome();
  }

  function snapRect(zone) {
    const A = workArea();
    const g = 8;
    if (zone === 'left') return { left: g, top: A.y + g, width: A.w / 2 - g * 1.5, height: A.h - g * 2 };
    if (zone === 'right') return { left: A.w / 2 + g / 2, top: A.y + g, width: A.w / 2 - g * 1.5, height: A.h - g * 2 };
    return { left: g, top: A.y + g, width: A.w - g * 2, height: A.h - g * 2 };
  }
  function setRect(win, r, animate = true) {
    const el = win.el;
    if (animate && !reduced()) {
      el.classList.add('is-anim');
      clearTimeout(win.animT);
      win.animT = setTimeout(() => el.classList.remove('is-anim'), 420);
    }
    Object.assign(el.style, px(r));
  }
  function toggleMax(id) {
    const win = WM.wins.get(id);
    if (!win || isMobile) return;
    if (win.max) {
      setRect(win, win.prev || snapRect('left'));
      win.max = false;
      win.el.classList.remove('is-max');
    } else {
      if (!win.snapped) win.prev = rectOf(win.el);
      setRect(win, snapRect('max'));
      win.max = true;
      win.snapped = false;
      win.el.classList.add('is-max');
    }
  }
  function showSnap(zone) {
    const sp = $('#snapPreview');
    if (!zone) { sp.classList.remove('is-on'); return; }
    Object.assign(sp.style, px(snapRect(zone)));
    sp.classList.add('is-on');
  }
  function applySnap(win, zone) {
    if (zone === 'max') { if (!win.max) toggleMax(win.id); return; }
    if (!win.max && !win.snapped) win.prev = rectOf(win.el);
    win.max = false;
    win.el.classList.remove('is-max');
    setRect(win, snapRect(zone));
    win.snapped = true;
  }

  function startMove(e, win) {
    if (isMobile || e.button !== 0 || e.target.closest('button, input, select, a')) return;
    e.preventDefault();
    const el = win.el;
    const bar = e.currentTarget;
    let r = el.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    let ox = r.left;
    let oy = r.top;
    let moved = false;
    let zone = null;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved) {
        if (Math.hypot(dx, dy) < 4) return;
        moved = true;
        document.body.classList.add('is-moving');
        if (win.max || win.snapped) {
          const prev = win.prev || { width: r.width * 0.7, height: r.height * 0.8 };
          const ratio = (sx - r.left) / r.width;
          el.classList.remove('is-anim', 'is-max');
          el.style.width = `${prev.width}px`;
          el.style.height = `${prev.height}px`;
          ox = sx - prev.width * ratio;
          oy = r.top;
          win.max = false;
          win.snapped = false;
          r = el.getBoundingClientRect();
        }
      }
      const top = mbH();
      el.style.left = `${Math.round(clamp(ox + dx, -r.width + 90, innerWidth - 90))}px`;
      el.style.top = `${Math.round(clamp(oy + dy, top, innerHeight - 48))}px`;
      const z = ev.clientX <= 4 ? 'left' : ev.clientX >= innerWidth - 5 ? 'right' : ev.clientY <= top + 2 ? 'max' : null;
      if (z !== zone) { zone = z; showSnap(zone); }
    };
    const up = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
      document.body.classList.remove('is-moving');
      if (zone) applySnap(win, zone);
      showSnap(null);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  }

  function startResize(e, win) {
    if (isMobile || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = win.el;
    const h = e.currentTarget;
    const sx = e.clientX;
    const sy = e.clientY;
    const sw = el.offsetWidth;
    const sh = el.offsetHeight;
    h.setPointerCapture(e.pointerId);
    document.body.classList.add('is-resizing');
    win.max = false;
    win.snapped = false;
    el.classList.remove('is-max');
    const move = (ev) => {
      el.style.width = `${Math.round(clamp(sw + ev.clientX - sx, 340, innerWidth - el.offsetLeft - 4))}px`;
      el.style.height = `${Math.round(clamp(sh + ev.clientY - sy, 220, innerHeight - el.offsetTop - 4))}px`;
    };
    const up = () => {
      h.removeEventListener('pointermove', move);
      h.removeEventListener('pointerup', up);
      h.removeEventListener('pointercancel', up);
      document.body.classList.remove('is-resizing');
    };
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', up);
    h.addEventListener('pointercancel', up);
  }

  function tileWindows() {
    const list = [...WM.wins.values()].filter((w) => !w.min);
    if (!list.length || isMobile) return;
    const A = workArea();
    const g = 8;
    const cols = Math.ceil(Math.sqrt(list.length));
    const rows = Math.ceil(list.length / cols);
    const cw = (A.w - g * (cols + 1)) / cols;
    const ch = (A.h - g * (rows + 1)) / rows;
    list.forEach((w, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      if (!w.max && !w.snapped) w.prev = rectOf(w.el);
      w.max = false;
      w.snapped = true;
      w.el.classList.remove('is-max');
      setRect(w, { left: g + c * (cw + g), top: A.y + g + r * (ch + g), width: cw, height: ch });
    });
  }

  function syncChrome() {
    const ids = [...WM.wins.keys()];
    $$('.dock-item').forEach((d) => {
      const k = d.dataset.app;
      d.classList.toggle('is-running', ids.some((id) => id === k || (k === 'projects' && id.startsWith('project:'))));
    });
    root.classList.toggle('has-sheet', isMobile && [...WM.wins.values()].some((w) => !w.min));
  }
  function bounce(id) {
    const key = keyOf(id) === 'project' ? 'projects' : keyOf(id);
    const d = $(`.dock-item[data-app="${key}"]`);
    if (!d || reduced()) return;
    d.classList.remove('is-launch');
    void d.offsetWidth;
    d.classList.add('is-launch');
    setTimeout(() => d.classList.remove('is-launch'), 1150);
  }

  /* ======================================================================
     Desktop icons, lasso, context menu
     ====================================================================== */
  const iconPos = {};
  function renderIcons() {
    $('#icons').innerHTML = DESKTOP.map((k, i) => `<button class="d-icon${MDOCK.includes(k) ? ' in-mdock' : ''}" type="button" role="listitem" data-app="${k}" style="--i:${i}" aria-label="Open ${esc(APPS[k].label)}">${appIcon(k)}<span class="d-label">${esc(APPS[k].label)}</span></button>`).join('');
    layoutIcons();
  }
  function layoutIcons() {
    const icons = $$('.d-icon');
    if (isMobile) { icons.forEach((el) => { el.style.left = ''; el.style.top = ''; }); return; }
    const avail = innerHeight - mbH() - DOCK_RESERVE - 8;
    const rows = Math.max(3, Math.floor(avail / 100));
    icons.forEach((el, i) => {
      const p = iconPos[el.dataset.app];
      el.style.left = `${p ? p.x : 16 + Math.floor(i / rows) * 94}px`;
      el.style.top = `${p ? p.y : 14 + (i % rows) * 100}px`;
    });
  }
  const clearSel = () => $$('.d-icon.is-selected').forEach((el) => el.classList.remove('is-selected'));

  function initIcons() {
    const wrap = $('#icons');
    let drag = null;
    wrap.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('.d-icon');
      if (!el || isMobile || e.button !== 0) return;
      closeMenu();
      if (e.ctrlKey || e.metaKey || e.shiftKey) { el.classList.toggle('is-selected'); return; }
      if (!el.classList.contains('is-selected')) { clearSel(); el.classList.add('is-selected'); }
      drag = { sx: e.clientX, sy: e.clientY, id: e.pointerId, src: el, moved: false, items: $$('.d-icon.is-selected').map((g) => ({ el: g, x: g.offsetLeft, y: g.offsetTop })) };
      el.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.sx;
      const dy = e.clientY - drag.sy;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      drag.moved = true;
      const maxX = innerWidth - 92;
      const maxY = innerHeight - mbH() - 96;
      drag.items.forEach((it) => {
        it.el.classList.add('is-dragging');
        it.el.style.left = `${clamp(it.x + dx, 0, maxX)}px`;
        it.el.style.top = `${clamp(it.y + dy, 0, maxY)}px`;
      });
    });
    const end = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        drag.items.forEach((it) => {
          it.el.classList.remove('is-dragging');
          const x = Math.round(it.el.offsetLeft / 8) * 8;
          const y = Math.round(it.el.offsetTop / 8) * 8;
          it.el.style.left = `${x}px`;
          it.el.style.top = `${y}px`;
          iconPos[it.el.dataset.app] = { x, y };
        });
        drag.src.dataset.dragged = '1';
      }
      drag = null;
    };
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    wrap.addEventListener('click', (e) => {
      const el = e.target.closest('.d-icon');
      if (!el) return;
      if (el.dataset.dragged) { delete el.dataset.dragged; return; }
      if (isMobile || !finePointer || e.detail === 0) openApp(el.dataset.app, { origin: el });
    });
    wrap.addEventListener('dblclick', (e) => {
      const el = e.target.closest('.d-icon');
      if (el && finePointer && !isMobile) openApp(el.dataset.app, { origin: el });
    });
  }

  function initLasso() {
    const desk = $('#desktop');
    const lasso = $('#lasso');
    let L = null;
    desk.addEventListener('pointerdown', (e) => {
      if (isMobile || e.button !== 0 || (e.target !== desk && e.target.id !== 'icons')) return;
      clearSel();
      closeMenu();
      const r = desk.getBoundingClientRect();
      L = { x: e.clientX - r.left, y: e.clientY - r.top, ox: r.left, oy: r.top, id: e.pointerId };
      desk.setPointerCapture(e.pointerId);
    });
    desk.addEventListener('pointermove', (e) => {
      if (!L || e.pointerId !== L.id) return;
      const x = e.clientX - L.ox;
      const y = e.clientY - L.oy;
      const box = { left: Math.min(x, L.x), top: Math.min(y, L.y), width: Math.abs(x - L.x), height: Math.abs(y - L.y) };
      if (box.width + box.height < 6) return;
      lasso.style.display = 'block';
      Object.assign(lasso.style, px(box));
      const b = { l: box.left + L.ox, t: box.top + L.oy, r: box.left + L.ox + box.width, btm: box.top + L.oy + box.height };
      $$('.d-icon').forEach((ic) => {
        const q = ic.getBoundingClientRect();
        ic.classList.toggle('is-selected', q.left < b.r && q.right > b.l && q.top < b.btm && q.bottom > b.t);
      });
    });
    const end = (e) => { if (L && e.pointerId === L.id) { L = null; lasso.style.display = 'none'; } };
    desk.addEventListener('pointerup', end);
    desk.addEventListener('pointercancel', end);
  }

  /* ---------- Menus ---------- */
  const menuEl = $('#menu');
  let menuAnchor = null;
  let menuItems = [];
  function showMenu(items, x, y, anchor) {
    menuItems = items;
    menuEl.innerHTML = items.map((it, i) => {
      if (it === '-') return '<hr>';
      if (it.heading) return `<div class="menu-label">${esc(it.heading)}</div>`;
      const lead = it.check !== undefined ? `<span class="mi-check">${it.check ? '✓' : ''}</span>` : it.icon ? svg(it.icon) : '<span class="mi-check"></span>';
      return `<button class="mi" type="button" role="menuitem" data-i="${i}"${it.disabled ? ' disabled' : ''}>${lead}<span>${esc(it.label)}</span>${it.kbd ? `<kbd>${esc(it.kbd)}</kbd>` : ''}</button>`;
    }).join('');
    menuEl.hidden = false;
    const w = menuEl.offsetWidth;
    const h = menuEl.offsetHeight;
    menuEl.style.left = `${clamp(x, 6, innerWidth - w - 6)}px`;
    menuEl.style.top = `${clamp(y, 6, innerHeight - h - 6)}px`;
    if (menuAnchor) menuAnchor.classList.remove('is-open');
    menuAnchor = anchor || null;
    if (menuAnchor) menuAnchor.classList.add('is-open');
  }
  function closeMenu() {
    if (menuEl.hidden) return;
    menuEl.hidden = true;
    if (menuAnchor) menuAnchor.classList.remove('is-open');
    menuAnchor = null;
  }
  menuEl.addEventListener('click', (e) => {
    const b = e.target.closest('.mi');
    if (!b) return;
    const it = menuItems[Number(b.dataset.i)];
    closeMenu();
    if (it && it.run) it.run();
  });
  document.addEventListener('pointerdown', (e) => {
    if (!menuEl.hidden && !e.target.closest('#menu, [data-menu], #mbLogo')) closeMenu();
  });

  const themeItem = () => (root.getAttribute('data-theme') === 'dark'
    ? { label: 'Switch to Light', icon: 'sun', run: toggleTheme }
    : { label: 'Switch to Dark', icon: 'moon', run: toggleTheme });
  const MENUS = {
    logo: () => [
      { label: 'About SakthiOS', icon: 'sparkle', run: () => openSettingsAbout() },
      { label: 'Settings…', icon: 'gear', run: () => openApp('settings') },
      '-',
      themeItem(),
      { label: 'Change Wallpaper', icon: 'image', run: cycleWallpaper },
      '-',
      { label: 'Classic Website', icon: 'ext', run: () => window.open('index.html', '_blank') },
      { label: 'Restart…', icon: 'power', run: restart },
    ],
    go: () => DESKTOP.filter((k) => k !== 'trash').map((k) => ({ label: APPS[k].label, icon: APPS[k].icon, run: () => openApp(k) })),
    window: () => {
      const list = [...WM.wins.values()];
      if (!list.length) return [{ label: 'No open windows', disabled: true }];
      const f = WM.focused;
      return [
        ...list.map((w) => ({ label: w.app.title + (w.min ? ' (minimised)' : ''), check: w.id === f, run: () => restore(w.id) })),
        '-',
        { label: 'Minimise', icon: 'window', kbd: '', disabled: !f, run: () => minimize(f) },
        { label: 'Zoom', icon: 'grid', disabled: !f, run: () => toggleMax(f) },
        { label: 'Tile All Windows', icon: 'tile', run: tileWindows },
        '-',
        { label: 'Close Window', icon: 'x', kbd: 'Alt W', disabled: !f, run: () => closeWin(f) },
        { label: 'Close All', icon: 'x', run: () => [...WM.wins.keys()].forEach(closeWin) },
      ];
    },
    help: () => [
      { label: 'Welcome Guide', icon: 'sparkle', run: () => openApp('welcome') },
      { label: 'Search…', icon: 'search', kbd: `${MOD} K`, run: openSpot },
      { label: 'Keyboard Shortcuts', icon: 'keyboard', run: showShortcuts },
      '-',
      { label: 'Download Résumé', icon: 'download', run: downloadResume },
      { label: 'Email Sakthivel', icon: 'mail', run: () => openApp('contact') },
    ],
  };
  function openBarMenu(btn, key) {
    if (menuAnchor === btn) { closeMenu(); return; }
    const r = btn.getBoundingClientRect();
    showMenu(MENUS[key](), r.left, r.bottom + 4, btn);
  }
  function showShortcuts() {
    notify({ app: 'settings', title: 'Keyboard shortcuts', timeout: 10000, body: `<kbd>${MOD} K</kbd> search · <kbd>Ctrl Alt T</kbd> terminal<br><kbd>Alt W</kbd> close window · <kbd>Esc</kbd> close menus<br>Double-click a title bar to zoom; drag it to a screen edge to snap.` });
  }
  function restart() {
    try { sessionStorage.removeItem('sos-booted'); } catch (e) { /* ignore */ }
    location.reload();
  }
  function openSettingsAbout() {
    const w = openApp('settings');
    if (w) setTimeout(() => { const a = $('.set-about', w.body); if (a) a.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); }, 350);
  }

  function initContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      if (isMobile || e.target.closest('.win, input, textarea, a, .menubar, .dock')) return;
      if (!e.target.closest('#desktop')) return;
      e.preventDefault();
      const ic = e.target.closest('.d-icon');
      if (ic) {
        const k = ic.dataset.app;
        clearSel();
        ic.classList.add('is-selected');
        showMenu([
          { label: `Open ${APPS[k].label}`, icon: 'arrow', run: () => openApp(k, { origin: ic }) },
          '-',
          { label: 'Clean Up Icons', icon: 'grid', run: cleanUpIcons },
        ], e.clientX, e.clientY);
        return;
      }
      showMenu([
        { label: 'New Terminal', icon: 'terminal', kbd: 'Ctrl Alt T', run: () => openApp('terminal') },
        { label: 'New Message', icon: 'mail', run: () => openApp('contact') },
        '-',
        { label: 'Change Wallpaper', icon: 'image', run: cycleWallpaper },
        themeItem(),
        { label: 'Clean Up Icons', icon: 'grid', run: cleanUpIcons },
        '-',
        { label: 'Search…', icon: 'search', kbd: `${MOD} K`, run: openSpot },
        { label: 'About SakthiOS', icon: 'sparkle', run: openSettingsAbout },
      ], e.clientX, e.clientY);
    });
  }
  function cleanUpIcons() { Object.keys(iconPos).forEach((k) => delete iconPos[k]); layoutIcons(); }

  /* ======================================================================
     Dock
     ====================================================================== */
  function renderDock() {
    const dock = $('#dock');
    dock.innerHTML = DOCK.map((k) => (k === '|'
      ? '<span class="dock-sep" aria-hidden="true"></span>'
      : `<button class="dock-item${MDOCK.includes(k) ? ' m-dock' : ''}" type="button" data-app="${k}" aria-label="${esc(APPS[k].label)}"><span class="dock-tip">${esc(APPS[k].label)}</span>${appIcon(k)}</button>`)).join('');
    dock.addEventListener('click', (e) => {
      const b = e.target.closest('.dock-item');
      if (b) dockClick(b.dataset.app, b);
    });
    if (finePointer) {
      const items = $$('.dock-item', dock);
      dock.addEventListener('pointermove', (e) => {
        if (isMobile || reduced()) return;
        dock.classList.add('is-hover');
        items.forEach((it) => {
          const r = it.getBoundingClientRect();
          const d = e.clientX - (r.left + r.width / 2);
          it.style.setProperty('--s', (1 + 0.5 * Math.exp(-(d * d) / (2 * 60 * 60))).toFixed(3));
        });
      });
      dock.addEventListener('pointerleave', () => {
        dock.classList.remove('is-hover');
        items.forEach((it) => it.style.setProperty('--s', '1'));
      });
    }
  }
  function dockClick(key, el) {
    const win = WM.wins.get(key);
    if (!win) { openApp(key, { origin: el }); return; }
    if (win.min) restore(key);
    else if (WM.focused === key && !isMobile) minimize(key);
    else focus(key);
  }

  /* ======================================================================
     Spotlight search
     ====================================================================== */
  const spot = $('#spot');
  const spotInput = $('#spotInput');
  const spotList = $('#spotList');
  let spotOpen = false;
  let spotItems = [];
  let spotIdx = 0;
  const GROUP_ORDER = ['Apps', 'Projects', 'Skills', 'Actions'];

  function spotIndex() {
    const apps = DESKTOP.map((k) => ({ group: 'Apps', label: APPS[k].label, hint: 'App', icon: appIcon(k), kw: `${k} ${APPS[k].title}`, run: () => openApp(k) }));
    const projects = PROJECTS.map((p, i) => ({ group: 'Projects', label: p.title, hint: p.org, icon: projIcon(p), kw: [p.org, p.summary, ...p.stack].join(' '), run: () => openApp(`project:${i}`) }));
    const skills = SKILLS.flatMap((g) => g.items.map((s) => ({ group: 'Skills', label: s, hint: g.name, icon: appIcon('skills'), kw: g.name, run: () => openApp('skills') })));
    const actions = [
      { label: 'Download résumé', hint: 'PDF', g: 'download', kw: 'resume cv pdf', run: downloadResume },
      { label: 'Copy email address', hint: PROFILE.email, g: 'copy', kw: 'email mail contact', run: copyEmail },
      { label: 'Switch theme', hint: 'Dark / Light', g: 'sun', kw: 'theme dark light mode', run: toggleTheme },
      { label: 'Change wallpaper', g: 'image', kw: 'wallpaper background', run: cycleWallpaper },
      { label: 'Hire Sakthivel', hint: '✨', g: 'sparkle', kw: 'hire job work contact recruit', run: hireMe },
      { label: 'Open LinkedIn', g: 'linkedin', kw: 'linkedin social profile', run: () => window.open(PROFILE.linkedin, '_blank', 'noopener') },
      { label: 'Open GitHub', g: 'github', kw: 'github code repos', run: () => window.open(PROFILE.github, '_blank', 'noopener') },
      { label: 'Tile all windows', g: 'tile', kw: 'tile arrange windows layout', run: tileWindows },
      { label: 'Classic website', g: 'ext', kw: 'classic old simple website', run: () => window.open('index.html', '_blank') },
    ].map((a) => ({ ...a, group: 'Actions', icon: `<span class="act-ico">${svg(a.g)}</span>` }));
    return { apps, projects, skills, actions };
  }
  function renderSpot() {
    const q = spotInput.value.trim().toLowerCase();
    const idx = spotIndex();
    let list;
    if (!q) list = [...idx.apps.filter((a) => a.label !== 'Trash'), ...idx.actions.slice(0, 5)];
    else {
      const score = (it) => (it.label.toLowerCase().startsWith(q) ? 0 : it.label.toLowerCase().includes(q) ? 1 : 2);
      list = [...idx.apps, ...idx.projects, ...idx.skills, ...idx.actions]
        .filter((it) => `${it.label} ${it.kw || ''} ${it.hint || ''}`.toLowerCase().includes(q))
        .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || score(a) - score(b))
        .slice(0, 16);
    }
    spotItems = list;
    spotIdx = 0;
    if (!list.length) {
      spotList.innerHTML = `<div class="spot-empty">No results for “${esc(spotInput.value)}”. Try “angular”, “resume” or “health”.</div>`;
      return;
    }
    let html = '';
    let last = '';
    list.forEach((it, i) => {
      if (it.group !== last) { html += `<div class="spot-group">${it.group}</div>`; last = it.group; }
      html += `<button class="spot-item${i === 0 ? ' is-active' : ''}" type="button" role="option" data-i="${i}">${it.icon}<span>${esc(it.label)}</span>${it.hint ? `<small>${esc(it.hint)}</small>` : ''}</button>`;
    });
    spotList.innerHTML = html;
  }
  function setSpotIdx(i, scroll = true) {
    if (!spotItems.length) return;
    spotIdx = (i + spotItems.length) % spotItems.length;
    $$('.spot-item', spotList).forEach((b) => b.classList.toggle('is-active', Number(b.dataset.i) === spotIdx));
    const a = $('.spot-item.is-active', spotList);
    if (a && scroll) a.scrollIntoView({ block: 'nearest' });
  }
  function runSpot(i) {
    const it = spotItems[i];
    closeSpot();
    if (it) setTimeout(() => it.run(), 60);
  }
  function openSpot() {
    closeMenu();
    spotOpen = true;
    spot.classList.add('is-open');
    spot.setAttribute('aria-hidden', 'false');
    spotInput.value = '';
    renderSpot();
    setTimeout(() => spotInput.focus(), 30);
  }
  function closeSpot() {
    spotOpen = false;
    spot.classList.remove('is-open');
    spot.setAttribute('aria-hidden', 'true');
    spotInput.blur();
  }
  function initSpot() {
    spotInput.addEventListener('input', renderSpot);
    spotInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSpotIdx(spotIdx + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSpotIdx(spotIdx - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); runSpot(spotIdx); }
    });
    spotList.addEventListener('click', (e) => { const b = e.target.closest('.spot-item'); if (b) runSpot(Number(b.dataset.i)); });
    spotList.addEventListener('pointermove', (e) => { const b = e.target.closest('.spot-item'); if (b && Number(b.dataset.i) !== spotIdx) setSpotIdx(Number(b.dataset.i), false); });
    spot.addEventListener('pointerdown', (e) => { if (e.target === spot) closeSpot(); });
    $('#mbSearch').addEventListener('click', () => (spotOpen ? closeSpot() : openSpot()));
  }

  /* ======================================================================
     Clock + widgets
     ====================================================================== */
  function initClock() {
    const ticks = $('#clockTicks');
    if (ticks) {
      ticks.innerHTML = Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const big = i % 3 === 0;
        const r1 = big ? 35 : 38.5;
        const r2 = 42.5;
        return `<line class="tick${big ? ' big' : ''}" x1="${(50 + Math.sin(a) * r1).toFixed(2)}" y1="${(50 - Math.cos(a) * r1).toFixed(2)}" x2="${(50 + Math.sin(a) * r2).toFixed(2)}" y2="${(50 - Math.cos(a) * r2).toFixed(2)}"/>`;
      }).join('');
    }
    const tz = 'Asia/Kolkata';
    const fLong = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
    const fParts = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: tz });
    const fDate = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz });
    const hH = $('#handH');
    const hM = $('#handM');
    const hS = $('#handS');
    const tick = () => {
      const now = new Date();
      const P = Object.fromEntries(fParts.formatToParts(now).map((p) => [p.type, p.value]));
      const h = Number(P.hour) % 24;
      const m = Number(P.minute);
      const s = Number(P.second);
      const h12 = h % 12 || 12;
      const ap = h < 12 ? 'AM' : 'PM';
      const long = fLong.format(now).replace(/,/g, '').replace(/\s?(am|pm)$/i, (x) => ` ${x.trim().toUpperCase()}`);
      $$('[data-clock-long]').forEach((el) => { el.textContent = long; });
      $$('[data-clock-short]').forEach((el) => { el.textContent = `${h12}:${pad2(m)}`; });
      $$('[data-clock]').forEach((el) => { el.textContent = `${h12}:${pad2(m)} ${ap} IST`; });
      const wt = $('#wTime');
      if (wt) wt.innerHTML = `${h12}:${pad2(m)}<small>${ap}</small>`;
      const wd = $('#wDate');
      if (wd) wd.textContent = fDate.format(now);
      if (hH) {
        hH.setAttribute('transform', `rotate(${(h % 12) * 30 + m * 0.5} 50 50)`);
        hM.setAttribute('transform', `rotate(${m * 6 + s * 0.1} 50 50)`);
        hS.setAttribute('transform', `rotate(${s * 6} 50 50)`);
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  function initParallax() {
    if (!finePointer) return;
    const wp = $('.wallpaper');
    let raf = 0;
    let mx = 0;
    let my = 0;
    window.addEventListener('pointermove', (e) => {
      if (reduced()) return;
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        wp.style.setProperty('--mx', mx.toFixed(3));
        wp.style.setProperty('--my', my.toFixed(3));
      });
    }, { passive: true });
  }

  /* ======================================================================
     Apps
     ====================================================================== */
  function renderWelcome(body) {
    body.innerHTML = `
      <div class="app-pad wel">
        <div class="wel-top">
          <img class="wel-avatar" src="sakthivel.jpeg" alt="Sakthivel" width="78" height="78">
          <div>
            <p class="eyebrow">README.md</p>
            <h2 class="h-xl">Hi, I'm <span class="grad">Sakthivel</span> 👋</h2>
            <p class="wel-role">Full Stack Developer · Chennai, India <span class="avail-pill"><i class="dot-live"></i>Open to work</span></p>
          </div>
        </div>
        <p class="lead">I build fast, reliable web &amp; mobile apps with <b>Angular, NestJS, Express and PostgreSQL</b>. Right now I'm building <b>AI-powered healthcare products</b> at VA Meditek, from database design all the way to VPS deployment. 3.4+ years, 7 developers led and mentored, one hackathon award.</p>
        <p class="lead">This portfolio is a tiny operating system I built from scratch with plain HTML, CSS and JavaScript. Open the apps and look around.</p>
        <div class="wel-actions">
          <button class="btn btn-primary" type="button" data-open="projects">${svg('folder')}See my projects</button>
          <button class="btn" type="button" data-open="about">${svg('user')}About me</button>
          <button class="btn" type="button" data-open="terminal">${svg('terminal')}Terminal</button>
          <button class="btn" type="button" data-act="hire">${svg('sparkle')}Hire me</button>
        </div>
        <div class="wel-tips">
          <div class="desk-only"><kbd>Double-click</kbd> an icon to open it</div>
          <div class="desk-only"><kbd>Drag</kbd> a title bar; drop it at a screen edge to snap</div>
          <div class="desk-only"><kbd>${MOD} K</kbd> search everything</div>
          <div class="desk-only"><kbd>Right-click</kbd> the desktop for more</div>
          <div class="touch-only"><kbd>Tap</kbd> an app on the home screen to open it</div>
          <div class="touch-only"><kbd>‹ Home</kbd> takes you back</div>
        </div>
        <p class="wel-foot">In a hurry? <button type="button" data-act="resume">Download my résumé</button> or open the <a class="link" href="index.html">main website</a>.</p>
      </div>`;
  }

  const FAMILY_SVG = `
    <svg class="family-scene" viewBox="0 0 520 210" role="img" aria-label="A family at home, connected by a heartbeat line to a phone app, a doctor and medicine">
      <defs>
        <linearGradient id="sceneGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color: var(--accent)"/><stop offset="1" style="stop-color: var(--accent-2)"/></linearGradient>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc4d0"/><stop offset="1" stop-color="#ff7d97"/></linearGradient>
      </defs>
      <path class="ln" d="M8 192 C90 180 170 196 260 188 S430 178 512 190"/>
      <path class="ln" d="M44 190 V122 L94 84 L144 122 V190"/>
      <path class="ln" d="M34 130 L94 78 L154 130"/>
      <path class="ln" d="M80 190 V158 H104 V190"/>
      <rect class="window" x="114" y="134" width="20" height="18" rx="3"/>
      <circle class="ln" cx="182" cy="122" r="9"/>
      <path class="ln" d="M173 190 V150 a9 9 0 0 1 18 0 V190"/>
      <circle class="ln" cx="216" cy="120" r="9"/>
      <path class="ln" d="M207 190 V148 a9 9 0 0 1 18 0 V190"/>
      <circle class="ln" cx="247" cy="148" r="7"/>
      <path class="ln" d="M240 190 V170 a7 7 0 0 1 14 0 V190"/>
      <path class="ln" d="M191 162 H207 M225 168 L240 176"/>
      <path class="heart" d="M214 92 C198 80 194 68 202 62 C208 58 213 61 214 66 C215 61 220 58 226 62 C234 68 230 80 214 92 Z"/>
      <path class="ln" d="M232 76 H266 L276 56 L288 98 L298 66 L306 76 H350"/>
      <path class="pulse" d="M232 76 H266 L276 56 L288 98 L298 66 L306 76 H350"/>
      <rect class="ln" x="352" y="36" width="60" height="112" rx="12"/>
      <path class="ln" d="M372 138 H392"/>
      <text x="382" y="98" text-anchor="middle">&lt;/&gt;</text>
      <path class="ln" d="M414 72 C424 64 426 66 432 66"/>
      <circle class="ln" cx="456" cy="66" r="24"/>
      <path class="ln" d="M456 54 V78 M444 66 H468"/>
      <g transform="rotate(-30 452 132)"><rect class="ln" x="434" y="124" width="36" height="16" rx="8"/><path class="ln" d="M452 124 V140"/></g>
      <path class="spark" d="M300 26 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/>
      <path class="spark s2" d="M146 50 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/>
      <path class="spark s3" d="M494 128 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/>
    </svg>`;

  function renderAbout(body) {
    body.innerHTML = `
      <div class="app-pad">
        <div class="ab-head">
          <figure class="ab-photo"><img src="sakthivel.jpeg" alt="Sakthivel working on his laptop at the office" width="400" height="500"></figure>
          <div class="ab-intro">
            <p class="eyebrow">About me</p>
            <h2>Code <span class="grad">+ care.</span></h2>
            <p class="lead">I'm Sakthivel, a full stack developer from Chennai with <b>3.4+ years</b> of turning complex ideas into fast, reliable products. My work is about care: I build <b>AI-powered healthcare apps</b> that help families reach doctors, labs and medicines in one place. I've led teams, mentored juniors and won an Achiever Award at a hackathon.</p>
            <dl class="ab-facts">
              <dt>Now</dt><dd>Full Stack Developer at VA Meditek</dd>
              <dt>Based in</dt><dd>Chennai, India</dd>
              <dt>Builds with</dt><dd>Angular · NestJS · Express · PostgreSQL · AI APIs</dd>
              <dt>Ships to</dt><dd>Linux VPS with Nginx &amp; PM2</dd>
              <dt>Speaks</dt><dd>Tamil (native), English, Telugu, Kannada</dd>
            </dl>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><b><span data-count="3.4" data-dec="1">0</span><sup>+</sup></b><span>Years of experience</span></div>
          <div class="stat"><b><span data-count="10">0</span><sup>+</sup></b><span>Projects delivered</span></div>
          <div class="stat"><b><span data-count="7">0</span></b><span>Developers led &amp; mentored</span></div>
          <div class="stat"><b><span data-count="1">0</span></b><span>Hackathon Achiever Award</span></div>
        </div>
        <figure class="concept">
          ${FAMILY_SVG}
          <figcaption><p class="eyebrow">Why I build</p><p>Software that keeps families healthy, from a doctor's video call to medicine at the door.</p></figcaption>
        </figure>
        <div class="wel-actions">
          <button class="btn btn-primary" type="button" data-open="experience">${svg('git')}My journey</button>
          <button class="btn" type="button" data-open="resume">${svg('pdf')}Résumé</button>
          <button class="btn" type="button" data-open="contact">${svg('mail')}Say hello</button>
        </div>
      </div>`;
    countUp(body);
  }

  const PJ_FILTERS = [
    { key: 'all', label: 'All projects', icon: 'grid', test: () => true },
    { key: 'vam', label: 'VA Meditek', icon: 'pulse', test: (p) => p.org === 'VA Meditek' },
    { key: 'fin', label: 'Finstein', icon: 'briefcase', test: (p) => p.org.startsWith('Finstein') },
    { key: 'own', label: 'Personal', icon: 'code', test: (p) => p.org === 'Personal' },
  ];
  const PJ_TAGS = [['Angular', '#ff8fa3'], ['NestJS', '#ffd38a'], ['AI APIs', '#8ff0df'], ['D3.js', '#a9d8ff'], ['Linux VPS', '#c7b8ff']];

  function renderProjects(body) {
    const st = { f: 'all', tag: null, q: '', view: 'grid', sel: 0 };
    body.innerHTML = `
      <div class="explorer">
        <aside class="ex-side">
          <h4>Folders</h4>
          ${PJ_FILTERS.map((f) => `<button class="ex-nav${f.key === 'all' ? ' is-active' : ''}" type="button" data-f="${f.key}">${svg(f.icon)}${f.label}<em>${PROJECTS.filter(f.test).length}</em></button>`).join('')}
          <h4>Tags</h4>
          ${PJ_TAGS.map(([t, c]) => `<button class="ex-nav" type="button" data-tag="${t}"><span style="width:9px;height:9px;border-radius:50%;background:${c};margin:0 3px"></span>${t}<em>${PROJECTS.filter((p) => p.stack.some((s) => s.startsWith(t))).length}</em></button>`).join('')}
        </aside>
        <div class="ex-main">
          <div class="ex-tool">
            <div class="ex-path">~/projects/<b data-path>all</b></div>
            <select class="ex-filter" aria-label="Filter projects">${PJ_FILTERS.map((f) => `<option value="${f.key}">${f.label}</option>`).join('')}</select>
            <label class="ex-search">${svg('search')}<input type="search" placeholder="Search" aria-label="Search projects"></label>
            <div class="seg" role="group" aria-label="View"><button type="button" class="is-on" data-view="grid" aria-label="Icon view">${svg('grid')}</button><button type="button" data-view="list" aria-label="List view">${svg('list')}</button></div>
          </div>
          <div class="ex-grid" role="listbox" aria-label="Projects"></div>
          <div class="ex-foot" data-foot></div>
        </div>
        <aside class="ex-prev" aria-live="polite"></aside>
      </div>`;
    const grid = $('.ex-grid', body);
    const prev = $('.ex-prev', body);
    const visible = () => PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => {
      if (!PJ_FILTERS.find((x) => x.key === st.f).test(p)) return false;
      if (st.tag && !p.stack.some((s) => s.startsWith(st.tag))) return false;
      if (st.q && ![p.title, p.org, p.summary, ...p.stack].join(' ').toLowerCase().includes(st.q)) return false;
      return true;
    });
    const foot = (n) => { $('[data-foot]', body).textContent = `${n} item${n === 1 ? '' : 's'} · ${finePointer && !isMobile ? 'double-click to open' : 'tap to open'}`; };
    function drawPrev() {
      const p = PROJECTS[st.sel];
      if (!p) { prev.innerHTML = `<div class="ex-empty">${svg('folder')}<p>Select a project to preview it.</p></div>`; return; }
      prev.innerHTML = `${projIcon(p)}<h3>${esc(p.title)}</h3><p class="sub">${esc(p.org)} · ${esc(p.period)}</p><p>${esc(p.summary)}</p>
        <dl class="kv"><dt>My role</dt><dd>${esc(p.role)}</dd><dt>Type</dt><dd>${isCompany(p) ? 'Company project' : 'Personal project'}</dd><dt>Demo</dt><dd>${p.link ? 'Live site' : 'Private'}</dd><dt>Year</dt><dd>${esc(p.year)}</dd></dl>
        ${isCompany(p) ? `<p class="pv-note">${svg('lock')}<span>${PRIVATE_NOTE}</span></p>` : ''}
        <div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
        <div class="btns"><button class="btn btn-primary btn-sm" type="button" data-open="project:${st.sel}">${svg('arrow')}Open details</button>${p.link ? `<a class="btn btn-sm" href="${p.link.href}" target="_blank" rel="noopener">${svg('ext')}Live site</a>` : ''}</div>`;
    }
    function draw() {
      const items = visible();
      if (items.length && !items.some(({ i }) => i === st.sel)) st.sel = items[0].i;
      grid.classList.toggle('is-list', st.view === 'list');
      grid.innerHTML = items.length
        ? items.map(({ p, i }) => `<button class="pj-item${i === st.sel ? ' is-selected' : ''}" type="button" role="option" aria-selected="${i === st.sel}" data-i="${i}">${projIcon(p, true)}<span class="pj-name">${esc(p.title)}</span><span class="pj-org">${esc(p.org)}</span><span class="pj-meta">${esc(p.year)}</span></button>`).join('')
        : '<div class="ex-empty">No projects match that search.</div>';
      $('[data-path]', body).textContent = st.tag ? `tags/${st.tag}` : PJ_FILTERS.find((x) => x.key === st.f).label.toLowerCase().replace(/\s+/g, '-');
      foot(items.length);
      drawPrev();
    }
    const setNav = (btn) => $$('.ex-nav', body).forEach((b) => b.classList.toggle('is-active', b === btn));
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.pj-item');
      if (!b) return;
      const i = Number(b.dataset.i);
      if (isMobile || !finePointer || e.detail === 0) { openApp(`project:${i}`, { origin: b }); return; }
      st.sel = i;
      $$('.pj-item', grid).forEach((x) => { x.classList.toggle('is-selected', x === b); x.setAttribute('aria-selected', String(x === b)); });
      drawPrev();
    });
    grid.addEventListener('dblclick', (e) => {
      const b = e.target.closest('.pj-item');
      if (b && finePointer && !isMobile) openApp(`project:${b.dataset.i}`, { origin: b });
    });
    $$('.ex-nav[data-f]', body).forEach((b) => b.addEventListener('click', () => { st.f = b.dataset.f; st.tag = null; setNav(b); $('.ex-filter', body).value = st.f; draw(); }));
    $$('.ex-nav[data-tag]', body).forEach((b) => b.addEventListener('click', () => { st.tag = b.dataset.tag; st.f = 'all'; setNav(b); draw(); }));
    $('.ex-filter', body).addEventListener('change', (e) => { st.f = e.target.value; st.tag = null; setNav($(`.ex-nav[data-f="${st.f}"]`, body)); draw(); });
    $('.ex-search input', body).addEventListener('input', (e) => { st.q = e.target.value.trim().toLowerCase(); draw(); });
    $$('[data-view]', body).forEach((b) => b.addEventListener('click', () => { st.view = b.dataset.view; $$('[data-view]', body).forEach((x) => x.classList.toggle('is-on', x === b)); draw(); }));
    draw();
  }

  function renderProjectDetail(body, i) {
    const p = PROJECTS[i];
    body.innerHTML = `
      <div class="pd-hero" style="--h:${p.hue}">
        ${projIcon(p)}
        <div>
          <p class="eyebrow">${esc(p.org)} · ${esc(p.year)}</p>
          <h2>${esc(p.title)}</h2>
          <div class="pd-meta"><span>${esc(p.role)}</span><span>${esc(p.period)}</span>${p.link ? '<span class="badge is-live">Live</span>' : `<span class="badge is-private">${svg('lock')}Private demo</span>`}${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}</div>
        </div>
      </div>
      <div class="pd-body">
        <p class="lead">${esc(p.summary)}</p>
        ${isCompany(p) ? `<p class="pv-note">${svg('lock')}<span>${PRIVATE_NOTE}</span></p>` : ''}
        <section><h3 class="section-h">What I built</h3><ul class="checks">${p.features.map((f) => `<li>${svg('check')}<span>${esc(f)}</span></li>`).join('')}</ul></section>
        <section><h3 class="section-h">Tech stack</h3><div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></section>
        <div class="wel-actions" style="margin-top:0">
          ${p.link ? `<a class="btn btn-primary" href="${p.link.href}" target="_blank" rel="noopener">${svg('ext')}${esc(p.link.label)}</a>` : ''}
          <button class="btn" type="button" data-open="projects">${svg('folder')}All projects</button>
          <button class="btn" type="button" data-open="contact">${svg('mail')}Ask me about it</button>
        </div>
      </div>`;
  }

  function renderExperience(body) {
    body.innerHTML = `
      <div class="gitlog">
        <div class="gl-cmd"><b>~/career</b> on <i>main</i> ❯ git log --graph --decorate --since=2022</div>
        ${EXPERIENCE.map((x, i) => `
          <div class="gl-row${i === 0 ? ' is-head' : ''}">
            <div class="gl-graph"><span class="gl-node"></span></div>
            <article class="gl-card">
              <div class="gl-top"><span class="gl-hash">${x.hash}</span>${x.refs.map(([t, l]) => `<span class="gl-ref is-${t}">${esc(l)}</span>`).join('')}<span class="gl-date">${esc(x.date)}</span></div>
              <h3>${esc(x.role)}</h3>
              <p class="gl-org">${esc(x.org)} · ${esc(x.place)}</p>
              <ul>${x.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
              <div class="chips">${x.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
            </article>
          </div>`).join('')}
        <p class="gl-end">(END) · first commit: July 2022</p>
      </div>`;
    if (!reduced()) {
      $$('.gl-card', body).forEach((c, i) => c.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 120 + i * 110, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
    }
  }

  function pkgJSON() {
    const q = (s) => `<span class="s">"${esc(s)}"</span>`;
    const p = (s) => `<span class="p">${s}</span>`;
    const k = (s) => `<span class="k">"${s}"</span>`;
    const lines = [p('{'), `  ${k('name')}${p(':')} ${q('sakthivel')}${p(',')}`, `  ${k('version')}${p(':')} ${q('3.4.0')}${p(',')}`, `  ${k('description')}${p(':')} ${q('Full stack developer · AI for healthcare')}${p(',')}`, `  ${k('location')}${p(':')} ${q('Chennai, India')}${p(',')}`, `  ${k('skills')}${p(': {')}`];
    SKILLS.forEach((g, gi) => {
      lines.push(`    ${k(g.key)}${p(': [')}`);
      for (let i = 0; i < g.items.length; i += 4) {
        const chunk = g.items.slice(i, i + 4).map(q).join(p(', '));
        lines.push(`      ${chunk}${i + 4 < g.items.length ? p(',') : ''}`);
      }
      lines.push(`    ${p(gi < SKILLS.length - 1 ? '],' : ']')}`);
    });
    lines.push(`  ${p('},')}`, `  ${k('openToWork')}${p(':')} <span class="n">true</span>`, p('}'));
    return lines.join('\n');
  }

  function initSphere(wrap, sphere, groups) {
    const items = SKILLS.flatMap((g) => g.items.map((t) => ({ t, g: g.key })));
    const tags = items.map((it) => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.textContent = it.t;
      el.dataset.group = it.g;
      sphere.appendChild(el);
      return el;
    });
    const n = tags.length;
    const pts = tags.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const th = Math.sqrt(n * Math.PI) * phi;
      return { x: Math.cos(th) * Math.sin(phi), y: Math.sin(th) * Math.sin(phi), z: Math.cos(phi) };
    });
    let radius = 150;
    let fs = 1;
    const AY = reduced() ? 0 : 0.0035;
    const AX = reduced() ? 0 : 0.0012;
    let vy = AY;
    let vx = AX;
    let tvy = AY;
    let tvx = AX;
    let dragging = false;
    let lx = 0;
    let ly = 0;
    let raf = 0;
    let alive = true;
    const rotate = (ax, ay) => {
      const cy = Math.cos(ay); const sy = Math.sin(ay); const cx = Math.cos(ax); const sx = Math.sin(ax);
      for (const q of pts) {
        const x1 = q.x * cy + q.z * sy;
        const z1 = -q.x * sy + q.z * cy;
        const y2 = q.y * cx - z1 * sx;
        const z2 = q.y * sx + z1 * cx;
        q.x = x1; q.y = y2; q.z = z2;
      }
    };
    const render = () => {
      for (let i = 0; i < n; i++) {
        const q = pts[i];
        const depth = (q.z + 1) / 2;
        const s = (0.55 + depth * 0.6) * fs;
        tags[i].style.transform = `translate(-50%, -50%) translate3d(${(q.x * radius).toFixed(1)}px, ${(q.y * radius).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        tags[i].style.opacity = (0.18 + depth * 0.82).toFixed(2);
        tags[i].style.zIndex = String(Math.round(depth * 100));
      }
    };
    const measure = () => {
      const side = Math.min(wrap.clientWidth, wrap.clientHeight || wrap.clientWidth);
      radius = side * 0.38;
      fs = side < 360 ? 0.82 : 1;
      render();
    };
    const loop = () => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden || wrap.offsetParent === null) return;
      if (!dragging) { vy += (tvy - vy) * 0.04; vx += (tvx - vx) * 0.04; }
      if (Math.abs(vx) > 1e-5 || Math.abs(vy) > 1e-5) { rotate(vx, vy); render(); }
    };
    wrap.addEventListener('pointerdown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener('pointermove', (e) => {
      if (dragging) {
        vy = (e.clientX - lx) * 0.006;
        vx = -(e.clientY - ly) * 0.006;
        lx = e.clientX; ly = e.clientY;
      } else if (finePointer && !reduced()) {
        const r = wrap.getBoundingClientRect();
        tvy = ((e.clientX - r.left) / r.width - 0.5) * 0.03;
        tvx = -((e.clientY - r.top) / r.height - 0.5) * 0.03;
      }
    });
    const endDrag = () => { dragging = false; };
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);
    wrap.addEventListener('pointerleave', () => { tvy = AY; tvx = AX; });
    groups.forEach((g) => {
      const on = () => { sphere.classList.add('has-hl'); tags.forEach((t) => t.classList.toggle('is-hl', t.dataset.group === g.dataset.group)); };
      const off = () => { sphere.classList.remove('has-hl'); tags.forEach((t) => t.classList.remove('is-hl')); };
      g.addEventListener('mouseenter', on); g.addEventListener('focus', on);
      g.addEventListener('mouseleave', off); g.addEventListener('blur', off);
    });
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(wrap);
    measure();
    loop();
    return () => { alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
  }

  function renderSkills(body, win) {
    body.innerHTML = `
      <div class="sk-bar">
        <div class="seg" role="tablist" aria-label="Skills view">
          <button type="button" role="tab" class="is-on" data-tab="sphere">${svg('cpu')}Overview</button>
          <button type="button" role="tab" data-tab="pkg">${svg('code')}package.json</button>
        </div>
        <p>Drag the sphere to spin it · hover a group to light it up</p>
      </div>
      <div class="sk-view is-on" data-view="sphere">
        <div class="sk-grid">
          <div class="sphere-wrap"><div class="sphere-glow"></div><div class="tag-sphere"></div></div>
          <div class="sk-groups">${SKILLS.map((g, i) => `<div class="sk-group" tabindex="0" data-group="${g.key}"><div class="sk-head"><i>${pad2(i + 1)}</i><b>${esc(g.name)}</b><em>${pad2(g.items.length)}</em></div><div class="chips">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>`).join('')}</div>
        </div>
        <div class="logo-strip" aria-label="Tools I use every day">${LOGOS.map(([f, n]) => `<span title="${n}"><img src="${f}" alt="${n}" loading="lazy" width="22" height="22"></span>`).join('')}</div>
      </div>
      <div class="sk-view" data-view="pkg"><pre class="pkg">${pkgJSON()}</pre></div>`;
    $$('[data-tab]', body).forEach((b) => b.addEventListener('click', () => {
      $$('[data-tab]', body).forEach((x) => x.classList.toggle('is-on', x === b));
      $$('.sk-view', body).forEach((v) => v.classList.toggle('is-on', v.dataset.view === b.dataset.tab));
    }));
    win.cleanup.push(initSphere($('.sphere-wrap', body), $('.tag-sphere', body), $$('.sk-group', body)));
  }

  function neofetch() {
    const art = [
      '    _____ ',
      '   / ___/ ',
      '   \\__ \\  ',
      '  ___/ /  ',
      ' /____/   ',
      '   OS     ',
    ].join('\n');
    const row = (k, v) => `<span class="hl">${k.padEnd(8)}</span>${v}`;
    const info = [
      '<span class="c2">sakthivel</span>@<span class="c2">sakthios</span>',
      '<span class="muted">──────────────────</span>',
      row('OS', 'SakthiOS 2026.11 (vanilla JS)'),
      row('Host', 'Chennai, India'),
      row('Uptime', '3.4+ years in production'),
      row('Role', 'Full Stack Developer'),
      row('Stack', 'Angular · NestJS · Express · PostgreSQL'),
      row('AI', 'OpenAI · Claude · Gemini · Python'),
      row('Deploy', 'Linux VPS · Nginx · PM2'),
      row('Status', '<span style="color:#4ade80">● open to work</span>'),
    ].join('\n');
    const colors = ['#031c1b', '#0f8a80', '#33c2ae', '#8ff0df', '#ffb9c7', '#ffd29b', '#a9d8ff', '#eaf7f4'].map((c) => `<i style="background:${c}"></i>`).join('');
    return `<div class="nf"><pre>${art}</pre><div><div class="nf-info">${info}</div><div class="nf-colors">${colors}</div></div></div>`;
  }

  function renderTerminal(body, win) {
    body.innerHTML = '<div class="term"><div class="term-out"></div><form class="term-line" autocomplete="off"><span class="prompt">sakthivel@sakthios<b>:~$</b></span><input type="text" spellcheck="false" autocapitalize="off" aria-label="Terminal command"></form></div>';
    const term = $('.term', body);
    const out = $('.term-out', body);
    const form = $('form', body);
    const input = $('input', body);
    const print = (html, cls) => {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.innerHTML = html;
      out.appendChild(d);
      term.scrollTop = term.scrollHeight;
      return d;
    };
    const echo = (c) => print(`<span class="prompt">sakthivel@sakthios<b>:~$</b></span>${esc(c)}`);
    const history = [];
    let hi = 0;
    const HELP = [
      ['help', 'show this list'], ['about', 'who am I?'], ['skills', 'my tech stack'], ['experience', 'where I have worked'],
      ['projects', 'things I have built'], ['education', 'degrees and awards'], ['contact', 'how to reach me'], ['resume', 'download my résumé'],
      ['open <app>', 'open an app (try: open projects)'], ['ls', 'list apps'], ['neofetch', 'system info'], ['deploy', 'ship to production 🚀'],
      ['theme', 'switch dark / light'], ['wallpaper', 'next wallpaper'], ['date', 'time in Chennai'], ['history', 'previous commands'],
      ['clear', 'clear the screen'], ['exit', 'close the terminal'], ['sudo hire-me', '✨ try it'],
    ];
    const CMDS = {
      help: () => `Available commands:\n\n${HELP.map(([c, d]) => `  <span class="hl">${esc(c.padEnd(16))}</span><span class="muted">${esc(d)}</span>`).join('\n')}`,
      about: () => '<span class="hl">Sakthivel</span> · Full Stack Developer · Chennai, India\n\n3.4+ years building web &amp; mobile apps with Angular, NestJS,\nExpress and PostgreSQL. Currently building AI-powered healthcare\nproducts at <span class="c2">VA Meditek</span>, deployed on a Linux VPS.\nLed teams, mentored juniors, won a hackathon award.',
      whoami: () => CMDS.about(),
      neofetch: () => neofetch(),
      skills: () => SKILLS.map((g) => `<span class="hl">${esc(g.name.padEnd(17))}</span>${esc(g.items.join(', '))}`).join('\n'),
      experience: () => EXPERIENCE.map((x) => `<span class="y">${x.hash}</span>  <span class="muted">${esc(x.date.padEnd(20))}</span><span class="hl">${esc(x.role)}</span> <span class="muted">@</span> <span class="c2">${esc(x.org)}</span>`).join('\n'),
      projects: () => `${PROJECTS.map((p, i) => `<span class="muted">${pad2(i + 1)}</span>  <span class="hl">${esc(p.title.padEnd(30))}</span><span class="muted">${esc(p.org)}</span>`).join('\n')}\n\n<span class="muted">Tip:</span> open projects`,
      education: () => EDUCATION.slice(0, 3).map((e) => `<span class="hl">${esc(e.title)}</span>  <span class="muted">${esc(e.year)} · ${esc(e.place)}</span>`).join('\n'),
      contact: () => `<span class="hl">email   </span> <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>\n<span class="hl">phone   </span> <a href="${PROFILE.phoneHref}">${PROFILE.phone}</a>\n<span class="hl">linkedin</span> <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">sakthi-vel</a>\n<span class="hl">github  </span> <a href="${PROFILE.github}" target="_blank" rel="noopener">sakthivelonestar</a>`,
      resume: () => { downloadResume(); return '<span class="c2">↓</span> Downloading sakthivel_fullstackdeveloper.pdf …'; },
      ls: () => DESKTOP.map((k) => (k === 'projects' ? '<span class="hl">Projects/</span>' : k === 'resume' ? 'Resume.pdf' : `<span class="c2">${APPS[k].label.replace(/\s/g, '')}.app</span>`)).join('  '),
      open: (args) => {
        const raw = (args[0] || '').toLowerCase().replace(/[^a-z]/g, '');
        const key = ALIASES[raw] || raw;
        if (APPS[key]) { setTimeout(() => openApp(key), 200); return `<span class="c2">→</span> opening <span class="hl">${esc(APPS[key].label)}</span>…`; }
        return `<span class="err">open: no such app: ${esc(args[0] || '')}</span>  <span class="muted">(try ls)</span>`;
      },
      cd: (args) => CMDS.open(args),
      theme: (args) => {
        const want = (args[0] || '').toLowerCase();
        const cur = root.getAttribute('data-theme');
        const next = want === 'dark' || want === 'light' ? want : cur === 'dark' ? 'light' : 'dark';
        if (next !== cur) toggleTheme();
        return `Theme set to <span class="hl">${next}</span>.`;
      },
      wallpaper: () => { cycleWallpaper(); return `Wallpaper set to <span class="hl">${root.getAttribute('data-wallpaper')}</span>.`; },
      date: () => `${new Intl.DateTimeFormat('en-IN', { dateStyle: 'full', timeStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date())} <span class="muted">(IST)</span>`,
      echo: (args) => esc(args.join(' ')),
      pwd: () => '/home/sakthivel',
      cat: (args) => (/resume/i.test(args[0] || '') ? 'Binary file. Try <span class="hl">open resume</span> or <span class="hl">resume</span>.' : `<span class="err">cat: ${esc(args[0] || '')}: no such file</span>`),
      git: (args) => (args[0] === 'log' ? (setTimeout(() => openApp('experience'), 200), '<span class="c2">→</span> opening git log (Experience)…') : '<span class="muted">usage: git log</span>'),
      rm: (args) => (args.join(' ').includes('-rf') ? '<span class="err">rm: refusing to delete a career 😅</span>' : '<span class="muted">rm: missing operand</span>'),
      deploy: () => {
        const steps = [
          ['ssh deploy@vps', 'connected · Linux VPS'],
          ['git pull origin main', 'up to date'],
          ['npm ci && npm run build', 'Angular SSR + API built'],
          ['pm2 reload ecosystem.config.js --update-env', 'zero-downtime reload'],
          ['sudo nginx -t && sudo systemctl reload nginx', 'reverse proxy + HTTPS ok'],
          ['curl -sI https://$DOMAIN', 'HTTP/2 200'],
        ];
        steps.forEach(([c, r], i) => setTimeout(() => {
          print(`<span class="muted">$</span> ${esc(c)}  <span class="hl">✓</span> <span class="muted">${esc(r)}</span>`);
          if (i === steps.length - 1) print('🚀 <span class="hl">Deployed.</span> Live on the VPS, kept alive by PM2.');
        }, 380 * (i + 1)));
        return '<span class="muted">Deploying to production…</span>';
      },
      'hire-me': () => CMDS.sudo(['hire-me']),
      sudo: (args) => {
        if (args.join(' ') === 'hire-me') { hireMe(); return '<span class="hl">[sudo]</span> permission granted ✓\nExcellent choice. Opening Mail…'; }
        return '<span class="err">Nice try.</span> You are not in the sudoers file. <span class="muted">This incident will be reported 😄</span>';
      },
      history: () => history.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join('\n'),
      clear: () => { out.innerHTML = ''; return null; },
      exit: () => { setTimeout(() => closeWin(win.id), 300); return 'logout'; },
    };
    const run = (raw) => {
      const line = raw.trim();
      echo(line);
      if (!line) return;
      history.push(line);
      hi = history.length;
      const [cmd, ...args] = line.split(/\s+/);
      const fn = CMDS[cmd.toLowerCase()];
      if (!fn) { print(`<span class="err">zsh: command not found: ${esc(cmd)}</span>  <span class="muted">(type <span class="hl">help</span>)</span>`); return; }
      const res = fn(args);
      if (res != null) print(res);
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = history[--hi]; }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hi < history.length - 1) input.value = history[++hi]; else { hi = history.length; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.value.trimStart().toLowerCase().split(/\s+/);
        if (parts.length === 1) {
          const m = Object.keys(CMDS).filter((c) => c.startsWith(parts[0]));
          if (m.length === 1) input.value = `${m[0]} `; else if (m.length > 1) print(m.join('  '), 'muted');
        } else if (parts[0] === 'open' || parts[0] === 'cd') {
          const m = Object.keys(APPS).filter((c) => c.startsWith(parts[1] || ''));
          if (m.length === 1) input.value = `${parts[0]} ${m[0]}`; else if (m.length > 1) print(m.join('  '), 'muted');
        }
      } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) { e.preventDefault(); out.innerHTML = ''; }
    });
    term.addEventListener('click', () => { if (!String(window.getSelection())) input.focus({ preventScroll: true }); });
    print(`<span class="muted">Last login: ${new Date().toDateString()} on ttys001</span>`);
    print(neofetch());
    print('Type <span class="hl">help</span> to see what I can do. Try <span class="hl">open projects</span>, <span class="hl">deploy</span> or <span class="hl">sudo hire-me</span>.');
    if (!isMobile) setTimeout(() => input.focus({ preventScroll: true }), 350);
  }

  function renderContact(body) {
    body.innerHTML = `
      <div class="mail">
        <aside class="mail-side">
          <h4>Reach me</h4>
          <button class="mc" type="button" data-act="copyEmail"><span class="mc-ico">${svg('mail')}</span><span class="mc-txt"><small>Email</small><span>${PROFILE.email}</span></span><em>Copy</em></button>
          <a class="mc" href="${PROFILE.phoneHref}"><span class="mc-ico">${svg('phone')}</span><span class="mc-txt"><small>Phone</small><span>${PROFILE.phone}</span></span><em>Call</em></a>
          <a class="mc" href="${PROFILE.linkedin}" target="_blank" rel="noopener"><span class="mc-ico">${svg('linkedin')}</span><span class="mc-txt"><small>LinkedIn</small><span>sakthi-vel</span></span><em>↗</em></a>
          <a class="mc" href="${PROFILE.github}" target="_blank" rel="noopener"><span class="mc-ico">${svg('github')}</span><span class="mc-txt"><small>GitHub</small><span>sakthivelonestar</span></span><em>↗</em></a>
          <div class="mc"><span class="mc-ico">${svg('pin')}</span><span class="mc-txt"><small>Chennai, India</small><span data-clock></span></span></div>
          <p class="avail"><i class="dot-live"></i><span>Open to full-time roles and interesting projects.</span></p>
        </aside>
        <form class="mail-compose" novalidate>
          <div class="mf-row"><span>To:</span><span class="to-chip">Sakthivel &lt;${PROFILE.email}&gt;</span></div>
          <label class="mf-row"><span>Name:</span><input name="name" type="text" required autocomplete="name" placeholder="Your name"></label>
          <label class="mf-row"><span>From:</span><input name="email" type="email" required autocomplete="email" placeholder="you@company.com"></label>
          <label class="mf-row"><span>Subject:</span><input name="subject" type="text" required placeholder="Let's work together"></label>
          <textarea name="message" required placeholder="Hi Sakthivel, …" aria-label="Message"></textarea>
          <div class="mf-foot"><p class="form-status" role="status" aria-live="polite"></p><button class="btn btn-primary btn-send" type="submit"><span>Send</span>${svg('send')}</button></div>
        </form>
      </div>`;
    const form = $('form', body);
    const btn = $('.btn-send', form);
    const label = $('span', btn);
    const status = $('.form-status', form);
    const EMAILJS = { publicKey: '4IsaU0jLyk7NQXfc8', service: 'service_3nbe2df', template: 'template_zwjthza' };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true;
      label.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';
      try {
        if (!window.emailjs) throw new Error('EmailJS failed to load');
        await window.emailjs.sendForm(EMAILJS.service, EMAILJS.template, form, EMAILJS.publicKey);
        btn.classList.add('is-flying');
        label.textContent = 'Sent ✓';
        status.textContent = "Thanks! Your message is on its way. I'll get back to you soon.";
        status.classList.add('ok');
        form.reset();
        confetti();
        notify({ app: 'contact', title: 'Message sent ✓', body: "Thanks for reaching out. I'll reply soon.", timeout: 5000 });
        setTimeout(() => { label.textContent = 'Send'; btn.classList.remove('is-flying'); }, 3500);
      } catch (err) {
        console.error('Contact form error:', err);
        label.textContent = 'Send';
        status.innerHTML = `Couldn't send right now. Please email me at <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>.`;
        status.classList.add('err');
      } finally {
        btn.disabled = false;
      }
    });
  }

  function renderResume(body) {
    const file = PROFILE.resume;
    const card = `<div class="pdf-card">${appIcon('resume')}<h3>Sakthivel · Résumé</h3><p>Full Stack Developer · 3.4+ years · Angular, NestJS, PostgreSQL, AI APIs, Linux VPS.</p><div class="wel-actions" style="justify-content:center;margin-top:4px"><a class="btn" href="${file}" target="_blank" rel="noopener">${svg('ext')}View</a><button class="btn btn-primary" type="button" data-act="resume">${svg('download')}Download</button></div></div>`;
    body.innerHTML = `
      <div class="pdf">
        <div class="pdf-tool">
          <div class="pdf-name">${appIcon('resume')}<span>${file}</span><small>1 page · A4</small></div>
          <a class="btn btn-sm desk-only" href="${file}" target="_blank" rel="noopener">${svg('ext')}Open</a>
          <button class="btn btn-primary btn-sm" type="button" data-act="resume">${svg('download')}Download</button>
        </div>
        ${isMobile ? card : `<iframe class="pdf-frame" src="${file}#view=FitH" title="Sakthivel's résumé (PDF)"></iframe>`}
      </div>`;
  }

  function renderEducation(body) {
    body.innerHTML = `<div class="edu">${EDUCATION.map((e) => `
      <article class="edu-card${e.wide ? ' wide' : ''}${e.award ? ' award' : ''}">
        <div class="edu-top"><span class="edu-year">${e.year}</span>${svg(e.icon)}</div>
        <h3>${esc(e.title)}</h3>
        <p class="edu-place">${esc(e.place)}</p>
        <p class="edu-score">${e.score}<small>${esc(e.small)}</small></p>
      </article>`).join('')}</div>`;
  }

  function renderSettings(body) {
    body.innerHTML = `
      <div class="app-pad settings">
        <section class="set-sec"><h3>Appearance</h3><div class="seg big" data-set="theme"><button type="button" data-v="dark">${svg('moon')}Dark</button><button type="button" data-v="light">${svg('sun')}Light</button></div></section>
        <section class="set-sec"><h3>Accent colour</h3><div class="set-row" data-set="accent">${ACCENTS.map(([k, c, n]) => `<button class="swatch" type="button" data-v="${k}" style="--sw:${c}" aria-label="${n} accent" title="${n}"></button>`).join('')}</div></section>
        <section class="set-sec"><h3>Wallpaper</h3><div class="set-row" data-set="wallpaper">${WALL_META.map(([k, n, th]) => `<button class="wp-thumb" type="button" data-v="${k}"><i style="--th:${th}"></i>${n}</button>`).join('')}</div></section>
        <section class="set-sec"><h3>Motion</h3><label class="switch"><input type="checkbox" data-set="reduce"> Reduce motion</label></section>
        <section class="set-sec set-about"><h3>About SakthiOS</h3><dl>
          <dt>Version</dt><dd>2026.11</dd>
          <dt>Built with</dt><dd>HTML, CSS and vanilla JavaScript. No frameworks.</dd>
          <dt>3D widget</dt><dd>Hand-written WebGL ray-marching shader</dd>
          <dt>Fonts</dt><dd>Geist, Geist Mono, Instrument Serif</dd>
          <dt>Made by</dt><dd>Sakthivel, in Chennai</dd>
        </dl></section>
      </div>`;
    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]');
      if (!b) return;
      const set = b.closest('[data-set]').dataset.set;
      if (set === 'theme' && b.dataset.v !== root.getAttribute('data-theme')) toggleTheme();
      if (set === 'accent') setAccent(b.dataset.v);
      if (set === 'wallpaper') setWallpaper(b.dataset.v);
    });
    $('input[data-set="reduce"]', body).addEventListener('change', (e) => setReduce(e.target.checked));
    syncSettings();
  }

  let trashEmpty = false;
  const TRASH = [
    ['bugs.log', '0 KB', 'All fixed ✓ (for now).'],
    ['callback-hell.js', '12 KB', 'Rewritten with async/await a long time ago.'],
    ['final-final-v3.psd', '88 MB', 'Design files from a past life.'],
    ['TODO-later.txt', '2 KB', '“Later” never came. It is in production now.'],
    ['node_modules', '∞', 'The heaviest object in the universe. Deleted.'],
  ];
  function renderTrash(body) {
    const draw = () => {
      body.innerHTML = `<div class="trash">
        <div class="tr-tool"><span>${trashEmpty ? '0 items' : `${TRASH.length} items`}</span><button class="btn btn-sm" type="button" data-empty${trashEmpty ? ' disabled' : ''}>${svg('trash')}Empty Trash</button></div>
        ${trashEmpty
          ? `<div class="tr-empty">${svg('trash')}<b>Trash is empty</b><p>Clean code only from here.</p></div>`
          : `<div class="tr-list">${TRASH.map(([n, s], i) => `<button class="tr-item" type="button" data-i="${i}">${svg(n === 'node_modules' ? 'folder' : 'file')}<span>${esc(n)}</span><small>${s}</small></button>`).join('')}</div>`}
      </div>`;
    };
    draw();
    body.addEventListener('click', (e) => {
      if (e.target.closest('[data-empty]')) {
        trashEmpty = true;
        draw();
        confetti();
        notify({ app: 'trash', title: 'Trash emptied 🧹', body: 'Bugs fixed. Clean code only from here.', timeout: 4500 });
        return;
      }
      const it = e.target.closest('.tr-item');
      if (it) { const [n, , msg] = TRASH[Number(it.dataset.i)]; notify({ app: 'trash', title: n, body: esc(msg), timeout: 4000 }); }
    });
  }

  /* ======================================================================
     Global wiring
     ====================================================================== */
  const ACTIONS = { resume: downloadResume, copyEmail, theme: toggleTheme, hire: hireMe, wallpaper: cycleWallpaper, search: openSpot };

  function initGlobal() {
    document.addEventListener('click', (e) => {
      const o = e.target.closest('[data-open]');
      if (o) { e.preventDefault(); openApp(o.dataset.open, { origin: o }); return; }
      const a = e.target.closest('[data-act]');
      if (a && ACTIONS[a.dataset.act]) { e.preventDefault(); ACTIONS[a.dataset.act](); }
    });
    document.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); if (spotOpen) closeSpot(); else openSpot(); return; }
      if (e.ctrlKey && e.altKey && k === 't') { e.preventDefault(); openApp('terminal'); return; }
      if (e.altKey && k === 'w' && WM.focused) { e.preventDefault(); closeWin(WM.focused); return; }
      if (e.key === 'Escape') { if (spotOpen) closeSpot(); else closeMenu(); }
    });
    $('#mbTheme').addEventListener('click', () => toggleTheme());
    $('#mbLogo').addEventListener('click', (e) => openBarMenu(e.currentTarget, 'logo'));
    [$('#mbLogo'), ...$$('[data-menu]')].forEach((b) => {
      const key = b.dataset.menu || 'logo';
      if (b.dataset.menu) b.addEventListener('click', () => openBarMenu(b, key));
      b.addEventListener('pointerenter', () => { if (menuAnchor && menuAnchor !== b && menuAnchor.closest('.menubar')) openBarMenu(b, key); });
    });

    let rT = 0;
    window.addEventListener('resize', () => {
      clearTimeout(rT);
      rT = setTimeout(() => {
        layoutIcons();
        if (isMobile) return;
        WM.wins.forEach((w) => {
          if (w.max) { setRect(w, snapRect('max'), false); return; }
          const r = rectOf(w.el);
          setRect(w, {
            width: Math.min(r.width, innerWidth - 16),
            height: Math.min(r.height, innerHeight - mbH() - 10),
            left: clamp(r.left, 0, Math.max(0, innerWidth - 120)),
            top: clamp(r.top, mbH(), Math.max(mbH(), innerHeight - 60)),
          }, false);
        });
      }, 120);
    });
    mqMobile.addEventListener('change', () => {
      isMobile = mqMobile.matches;
      layoutIcons();
      if (!isMobile) WM.wins.forEach((w) => { if (!w.el.style.width) place(w); });
      syncChrome();
    });
  }

  function boot() {
    const el = $('#boot');
    let fast = false;
    try { fast = sessionStorage.getItem('sos-booted') === '1'; } catch (e) { /* ignore */ }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try { sessionStorage.setItem('sos-booted', '1'); } catch (e) { /* ignore */ }
      el.classList.add('is-done');
      root.classList.add('is-ready');
      setTimeout(() => el.remove(), 900);
      window.__heroIntro = true;
      window.dispatchEvent(new Event('hero:intro'));
      setTimeout(startSession, reduced() ? 0 : 700);
    };
    if (reduced()) { finish(); return; }
    const ok = '<span class="ok">ok</span>';
    const lines = [
      `[ ${ok} ] Booting SakthiOS 2026.11`,
      `[ ${ok} ] Loading 3.4+ years of experience`,
      `[ ${ok} ] Mounting ~/projects (10+ shipped)`,
      `[ ${ok} ] Starting care.service: AI for health`,
      `[ ${ok} ] Stack: Angular · NestJS · PostgreSQL`,
      `[ ${ok} ] Deploy: Linux VPS · Nginx · PM2`,
      'Welcome, visitor.',
    ];
    const log = $('#bootLog');
    const bar = $('#bootBar');
    const step = fast ? 60 : 250;
    lines.forEach((ln, i) => setTimeout(() => {
      if (done) return;
      log.innerHTML += `${ln}\n`;
      bar.style.width = `${((i + 1) / lines.length) * 100}%`;
    }, 280 + i * step));
    setTimeout(finish, 280 + lines.length * step + (fast ? 120 : 450));
    el.addEventListener('pointerdown', finish);
    window.addEventListener('keydown', finish, { once: true });
  }

  function startSession() {
    const hash = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    const key = ALIASES[hash] || hash;
    if (isMobile) {
      if (APPS[key]) openApp(key);
      setTimeout(() => notify({
        app: 'welcome', title: 'Welcome to SakthiOS 👋', body: 'Tap an app to explore my work.', timeout: 8000,
        actions: [{ label: 'Projects', run: () => openApp('projects') }, { label: 'About me', run: () => openApp('about') }],
      }), 700);
      return;
    }
    openApp('welcome', { origin: $('.d-icon[data-app="welcome"]') });
    if (APPS[key] && key !== 'welcome') setTimeout(() => openApp(key, { origin: $(`.d-icon[data-app="${key}"]`) }), 350);
    setTimeout(() => notify({
      app: 'contact', title: 'Sakthivel is open to work', body: 'Full-time roles and interesting projects. Say hello in Mail.', timeout: 9000,
      actions: [{ label: 'Write a message', run: () => openApp('contact') }, { label: 'Résumé', run: () => openApp('resume') }],
    }), 5200);
  }

  renderIcons();
  renderDock();
  initIcons();
  initLasso();
  initContextMenu();
  initSpot();
  initClock();
  initParallax();
  initGlobal();
  boot();

  window.SakthiOS = { open: openApp, close: closeWin, minimize, restore, notify, toggleTheme };
})();
