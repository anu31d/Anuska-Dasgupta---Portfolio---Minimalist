/**
 * @file resume.ts
 * @description Centralized, strongly-typed resume and portfolio data structure for Anuska Dasgupta.
 * This file serves as the single source of truth for the academic records, professional experience,
 * technical skills, publications, and gallery milestones displayed throughout the portfolio.
 */

export interface ResumeData {
  name: string;
  tagline: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    leetcode: string;
    portfolio: string;
  };
  education: {
    degree: string;
    institution: string;
    period: string;
    details: string;
    cgpa: string;
  };
  summary: string[];
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    role: string;
    company: string;
    period: string;
    duration: string;
    location: string;
    type: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    period: string;
    technologies: string[];
    problem: string;
    solution: string;
    github?: string;
    live?: string;
    awards?: string;
  }[];
  publications: {
    title: string;
    conference: string;
    award: string;
    details: string;
  }[];
  achievements: string[];
  certifications: {
    name: string;
    issuer: string;
    grade: string;
    period: string;
    description: string;
  }[];
  leadership: {
    role: string;
    period: string;
    organization: string;
    bullets: string[];
  }[];
  languages: string[];
}

export const resumeData: ResumeData = {
  name: "Anuska Dasgupta",
  tagline: "Backend-first Software & ML Engineer | Happiest where ownership is given early and the work ships.",
  contact: {
    email: "anuska.dasguptaa@gmail.com",
    phone: "+91-7667361497",
    location: "India",
    github: "https://github.com/AnuskaDasgupta",
    linkedin: "https://linkedin.com/in/anuska-dasgupta",
    leetcode: "https://leetcode.com/Anuska-Dasgupta",
    portfolio: "https://anuska.dasgupta.portfolio"
  },
  education: {
    degree: "B.Tech in Computer Science and Engineering",
    institution: "SRM Institute of Science and Technology, India",
    period: "2023 – 2027",
    details: "Final-year student, top 5% of cohort.",
    cgpa: "CGPA: 9.57 / 10.0"
  },
  summary: [
    "I have been talking in front of people on stage since I was seven. Many years and a few trophies later, I also write code.",
    "Turns out both skills answer to the same standard – if you cannot explain what you built, you have not finished building it.",
    "Final-year B.Tech CSE at SRM Institute, 9.57 CGPA, top 5% of cohort. Backend-first across Python, Java, Flask, Spring Boot, and REST APIs with end-to-end ML pipelines, and enough React and TypeScript to ship the frontend too. Six projects built and deployed solo. Interned at Infosys Springboard in production. Best Paper at ICARECS 2026. Open to SWE, backend, and ML roles and internships – happiest where ownership is given early and the work ships."
  ],
  skills: [
    {
      category: "Languages",
      items: ["Java", "Python", "SQL"]
    },
    {
      category: "Backend",
      items: ["REST APIs", "Spring Boot", "Hibernate", "Flask", "JDBC", "Maven", "RBAC", "CI/CD", "GitHub Actions"]
    },
    {
      category: "Databases",
      items: ["MySQL", "PostgreSQL", "Schema Design", "3NF Normalisation", "Query Optimisation", "Indexing", "CRUD"]
    },
    {
      category: "AI / ML",
      items: ["Decision Trees", "Random Forest", "XGBoost", "Naive Bayes", "KNN", "Logistic Regression", "SVM", "NLP", "SHAP", "scikit-learn"]
    },
    {
      category: "Data Science",
      items: ["Pandas", "NumPy", "Matplotlib", "OpenAI API", "LLMs", "Prompt Engineering", "Sentiment Analysis", "Intent Classification"]
    },
    {
      category: "Tools",
      items: ["Git", "GitHub Actions", "Postman", "VS Code", "React 19", "Node.js", "Express.js", "TypeScript", "Tailwind CSS", "Recharts", "Gemini API"]
    }
  ],
  experience: [
    {
      role: "Backend Engineering Intern",
      company: "Infosys Springboard",
      period: "Dec 2025 – Jan 2026",
      duration: "2 Months",
      location: "Remote",
      type: "Internship",
      bullets: [
        "Attended weekly meetings and maintained daily GitHub commits throughout; designed RESTful APIs and 3NF-normalised PostgreSQL schemas for EcoPackAI on Flask; built dual ML pipelines integrating Random Forest and XGBoost with feature engineering workflows.",
        "Integrated SHAP for model explainability; set up GitHub Actions CI/CD pipeline; parameterised all SQL queries and enforced foreign-key constraints to prevent SQL injection and maintain referential integrity."
      ]
    },
    {
      role: "Operations and Process Improvement Intern",
      company: "Agroho NGO",
      period: "Jun 2025 – Jul 2025",
      duration: "1 Month",
      location: "On-site",
      type: "Internship",
      bullets: [
        "Built Python scripts to track field operations data across 200+ NGO members; identified workflow bottlenecks through data analysis and supported process redesign that improved outreach coordination efficiency."
      ]
    }
  ],
  projects: [
    {
      title: "CryptoGuard: Decision Tree Risk Classifier",
      period: "Jan 2026 – May 2026",
      technologies: ["Python", "scikit-learn", "Decision Trees", "Random Forest", "NLP", "REST APIs"],
      problem: "Crypto markets lack interpretable, real-time risk tools; black-box models sacrifice explainability for accuracy.",
      solution: "Built an interpretable ML pipeline on 37,082 OHLCV records across 23 cryptocurrencies; engineered 3 features – daily return, 7-day rolling volatility, and volume change – and derived Low, Medium, High risk labels via volatility thresholds. Decision Tree achieved 99.54% accuracy (macro F1: 0.99), outperforming Random Forest (96.33%), KNN (91.45%), Naive Bayes (87.12%), Logistic Regression, SVM, LSTM, ARIMA, and 9 additional published approaches. Exposed as a REST API enabling traders to query real-time risk scores per asset before executing positions. Best Paper, ICARECS 2026.",
      github: "https://github.com/AnuskaDasgupta/CryptoGuard",
      live: "https://cryptoguard.live",
      awards: "Best Paper, ICARECS 2026"
    },
    {
      title: "Mann: Your Safe Space – AI Mental Health Assistant",
      period: "Jan 2025 – Present",
      technologies: ["React", "TypeScript", "Node.js", "Express.js", "Gemini API", "NLP", "Prompt Engineering"],
      problem: "Mental health tools are generic and reactive – lacking personalisation, crisis detection, and emotional engagement.",
      solution: "Built a full-stack AI wellness platform with prompt-engineered LLM workflows for real-time emotionally aware conversations. Implemented MBTI-based personalisation, attachment-style mapping, and CBT-inspired thought reframing across 64 personality-adaptive profiles (16 MBTI types × 4 attachment styles). A dynamic Living Garden visualisation transforms user reflections into interactive emotional ecosystems. Crisis-detection safeguards and emotional insights dashboards built in from day one. 2nd Prize and Rs. 25,000, SARAM Expo 2025; experienced live by 2,000 attendees.",
      github: "https://github.com/AnuskaDasgupta/Mann",
      live: "https://mann.live",
      awards: "2nd Prize (Rs. 25,000), SARAM Expo 2025"
    },
    {
      "title": "EcoPackAI: Sustainable Packaging Recommender",
      "period": "Dec 2025 – Jan 2026",
      "technologies": ["Python", "Flask", "PostgreSQL", "Random Forest", "XGBoost", "SHAP", "REST APIs", "Recharts"],
      "problem": "Businesses manually weigh packaging cost, CO2, and material trade-offs with no explainability into decisions.",
      "solution": "Designed a full-stack recommender with dual ML pipelines – Random Forest for cost prediction and XGBoost for CO2 estimation – and SHAP explainability surfacing top feature drivers: recyclability (28%), emission factor (24%), cost-per-unit (19%). Engineered 4 composite scores per recommendation. Parameterised SQL reduced query latency 35% vs. document-store alternatives; reduced packaging decision time ~40% vs. manual evaluation. Sole developer; shipped to live production at Infosys Springboard.",
      "github": "https://github.com/AnuskaDasgupta/EcoPackAI"
    },
    {
      "title": "CleanIQ – AI-Powered Validation Platform",
      "period": "Jan 2025 – Present",
      "technologies": ["HTML", "TypeScript", "Gemini API", "Recharts"],
      "problem": "Client transaction datasets have inconsistent phone and date formats that only surface after import, delaying onboarding.",
      "solution": "Built a static, client-side validator with zero backend dependency – a deliberate decision to keep sensitive transaction data off external servers. Configurable country-specific phone and date rules run in the browser; Gemini-powered chat layer lets ops teams query error patterns in plain English and receive AI fix suggestions per failing row; auto-chunks large outputs into CSVs for downstream handling.",
      "github": "https://github.com/AnuskaDasgupta/CleanIQ",
      "live": "https://cleaniq.live"
    },
    {
      "title": "FitMe: AI Fitness Assistant",
      "period": "Feb 2026 – May 2026",
      "technologies": ["React 19", "TypeScript", "Tailwind CSS", "REST APIs", "Recharts"],
      "problem": "AI-generated fitness plans are one-shot outputs with no structured layer, making tracking and analytics brittle.",
      "solution": "Decoupled a REST API middleware layer between the AI inference endpoint and the analytics dashboard. TypeScript enforces type safety across deeply nested AI-generated objects, catching schema mismatches at compile time and reducing runtime data errors to zero. Recharts renders progress-tracking visualisations on a fully typed data layer with clean separation between plan generation, data persistence, and frontend consumption.",
      "github": "https://github.com/AnuskaDasgupta/FitMe"
    },
    {
      "title": "Student Database Management System",
      "period": "May 2025 – Jul 2025",
      "technologies": ["Java", "JDBC", "MySQL", "RBAC", "OOP", "System Design", "Schema Design"],
      "problem": "Manual academic record-keeping has no access control, leaving data open to privilege escalation and SQL injection.",
      "solution": "Built a Java/JDBC/MySQL DBMS with a 3NF schema, foreign-key constraints, and layered DAO/Service/Controller architecture. RBAC for Admin, Faculty, and Student roles centralised in the Service layer eliminates privilege escalation; all CRUD operations parameterised against SQL injection; JOIN queries optimised with indexing on student and course IDs; transaction management supports concurrent multi-role access with zero privilege escalation vulnerabilities by design.",
      "github": "https://github.com/AnuskaDasgupta/StudentDB",
      "live": "https://studentdb.live"
    }
  ],
  publications: [
    {
      title: "Decision Tree-Based Risk Classification Model for Cryptocurrency Trading",
      conference: "ICARECS 2026",
      award: "Best Paper Award",
      details: "Benchmarked Decision Tree against Random Forest, Naive Bayes, KNN, Logistic Regression, SVM, LSTM, ARIMA, N-BEATS, and 9+ additional published approaches; established the case for interpretable threshold-aligned decision boundaries over black-box ensembles."
    }
  ],
  achievements: [
    "Best Paper Award, ICARECS 2026 – 'Decision Tree-Based Risk Classification for Cryptocurrency Trading'; benchmarked against 14+ published approaches.",
    "2nd Prize and Rs. 25,000, SARAM Expo 2025 – Mann AI mental health platform; experienced live by 2,000+ attendees.",
    "1st Place, Oratorical Competition (2023) | 2nd Place, Oral Presentation (2023) – SRM Institute."
  ],
  certifications: [
    {
      name: "Python for Data Science and Machine Learning",
      issuer: "NPTEL IIT Madras",
      grade: "Elite Grade",
      period: "Jan – Feb 2026",
      description: "8-week course on supervised learning, data pipelines, and applied ML; awarded Elite grade for top-percentile performance."
    }
  ],
  leadership: [
    {
      role: "Vice President (Nov 2024 – Aug 2025) | Lead, Technical and Innovation Domain (Aug – Nov 2024) | Member (Jan – Aug 2024)",
      organization: "Intellects Club SRM Ramapuram",
      period: "Jan 2024 – Aug 2025",
      bullets: [
        "Led overall club operations; managed cross-functional teams across flagship events and hackathons; built external collaborations and drove strategic growth initiatives.",
        "Headed the technical wing as Lead; mentored junior members on backend engineering, ML, and full-stack development; progressed from curious member to Vice President in under a year by showing up consistently and caring about the work more than the title."
      ]
    },
    {
      role: "NSS Discipline Core Committee Member",
      organization: "National Service Scheme (NSS)",
      period: "Sep 2023 – Sep 2025",
      bullets: [
        "Ran operations for 5+ campus-wide programs covering 1,000+ participants."
      ]
    }
  ],
  languages: ["English (Fluent, Professional)", "Hindi (Native)", "Bengali (Native)"]
};
