import React, { useState, useEffect, useRef } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Cpu, 
  Database, 
  Award, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Terminal, 
  Code, 
  Menu, 
  X, 
  ArrowUpRight, 
  Search, 
  FileText, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowRight,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings,
  Tag,
  GitBranch,
  Sliders
} from "lucide-react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import { resumeData, ResumeData } from "./data/resume";
import DevConsole from "./components/DevConsole";

/*
  ==================================================================
  DEVELOPER NOTE: SKILL PROFICIENCIES & CONTEXTS MAP
  This file uses standard lookup tables to define individual skill metrics
  (proficiency percentages out of 100) and descriptions. 
  
  To customize or add a new skill to the radar or charts:
  1. Add your key and skill rating in 'skillProficiencies' (e.g. "Docker": 90).
  2. Add your key and detailed description in 'skillContexts'.
  3. Ensure the spelling matches the skill names inside /src/data/resume.ts.
  ==================================================================
*/
const skillProficiencies: Record<string, number> = {
  "Python": 95,
  "Java": 90,
  "SQL": 92,
  "REST APIs": 95,
  "Spring Boot": 92,
  "Hibernate": 85,
  "Flask": 88,
  "JDBC": 88,
  "Maven": 80,
  "RBAC": 85,
  "CI/CD": 88,
  "MySQL": 92,
  "PostgreSQL": 92,
  "Schema Design": 95,
  "3NF Normalisation": 95,
  "Query Optimisation": 90,
  "Indexing": 85,
  "CRUD": 95,
  "Decision Trees": 95,
  "Random Forest": 92,
  "XGBoost": 95,
  "Naive Bayes": 85,
  "KNN": 88,
  "Logistic Regression": 85,
  "SVM": 80,
  "NLP": 88,
  "SHAP": 90,
  "scikit-learn": 92,
  "Pandas": 92,
  "NumPy": 90,
  "Matplotlib": 85,
  "OpenAI API": 88,
  "LLMs": 88,
  "Prompt Engineering": 90,
  "Sentiment Analysis": 88,
  "Intent Classification": 90,
  "Git": 95,
  "GitHub Actions": 90,
  "Postman": 90,
  "VS Code": 95,
  "React 19": 85,
  "Node.js": 84,
  "Express.js": 84,
  "TypeScript": 85,
  "Tailwind CSS": 88,
  "Recharts": 82,
  "Gemini API": 92
};

const skillContexts: Record<string, string> = {
  "Java": "Used for robust object-oriented software engineering & Spring Boot core microservice APIs.",
  "Python": "Primary language for model engineering, data science pipelines, and Flask-based service layers.",
  "SQL": "Core language for database transactions, parameterized querying, and data analytics tasks.",
  "REST APIs": "Engineered highly scalable REST web APIs with parameter binding and structural payload validations.",
  "Spring Boot": "Enterprise-grade Spring structures, Hibernate mappings, and role-based request authorisations.",
  "Hibernate": "Object-relational mapping standard for fluid PostgreSQL and MySQL schemas.",
  "Flask": "Built lightweight microservices hosting machine learning model scoring pipelines.",
  "JDBC": "Direct parameterized database adapter queries with strict SQL injection safeguards.",
  "Maven": "Standardized dependency orchestration and secure multi-module packaging configurations.",
  "MySQL": "Relational storage systems, transactional schemas, and analytical grouping queries.",
  "PostgreSQL": "Implemented 3NF-normalized database systems with relational constraints for EcoPackAI.",
  "Schema Design": "Structured database topologies with primary and foreign key constraints for consistency.",
  "3NF Normalisation": "Reduced operational data redundancies and prevented anomalous database side effects.",
  "Query Optimisation": "Reconstructed queries, utilized indexing techniques, and minimized nested table joins.",
  "Decision Trees": "Built CryptoGuard, outperforming 9+ models with 99.54% classification accuracy.",
  "Random Forest": "Constructed ensemble decision frameworks with optimized tree estimator settings.",
  "XGBoost": "Created state-of-the-art gradient boosted ensembles for extreme accuracy benchmarks.",
  "NLP": "Structured sequence text classification and crisis intent patterns in Mann Wellness.",
  "SHAP": "Configured feature contribution explainer visual summaries for user transparency.",
  "scikit-learn": "Primary library for training pipelines, train-test splits, and confusion matrices.",
  "Pandas": "Parsed, massaged, and engineered feature datasets of over 37,000 temporal rows.",
  "NumPy": "Utilized for multidimensional matrix linear calculations and performance optimizations.",
  "Matplotlib": "Constructed custom scatter charts and feature ranking representations.",
  "LLMs": "Configured MBTI-adaptive cognitive behavioral therapy prompt loops for Mann wellness.",
  "Gemini API": "Powers conversational AI flows and cognitive interactions for the Mann mental health platform.",
  "React 19": "Constructed modern functional single page user interfaces with layout state managers.",
  "TypeScript": "Guaranteed compiler type-safety, interface parameters, and modular development frameworks."
};

function LightboxKeyboardHelper({ 
  onClose, 
  onPrev, 
  onNext 
}: { 
  onClose: () => void; 
  onPrev: () => void; 
  onNext: () => void; 
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return null;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "academic" | "skills" | "gallery">("projects");
  const mainContentRef = useRef<HTMLElement | null>(null);
  const isFirstRender = useRef(true);

  // Smoothly scroll the page down to the active tab panel whenever the user selects a new tab
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeTab]);

  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    "CryptoGuard: Decision Tree Risk Classifier": true, // Default open first
    "Mann: Your Safe Space – AI Mental Health Assistant": true
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Skills Tab Filtering States
  const [skillSearch, setSkillSearch] = useState("");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const [customResumeExists, setCustomResumeExists] = useState(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);

  // Check custom resume status on component mount
  useEffect(() => {
    fetch("/api/resume/status")
      .then(res => res.json())
      .then(data => setCustomResumeExists(data.exists))
      .catch(err => console.error("Error checking resume status:", err));
  }, []);

  // Detect hidden dev console activation via hash, path, or query param (not visible to public)
  useEffect(() => {
    const checkDevMode = () => {
      if (
        window.location.search.includes("dev=true") || 
        window.location.hash === "#dev" ||
        window.location.pathname === "/dev-console"
      ) {
        setIsDevConsoleOpen(true);
      }
    };
    checkDevMode();
    window.addEventListener("popstate", checkDevMode);
    window.addEventListener("hashchange", checkDevMode);
    return () => {
      window.removeEventListener("popstate", checkDevMode);
      window.removeEventListener("hashchange", checkDevMode);
    };
  }, []);

  /* 
    ==================================================================
    DEVELOPER NOTE: PORTFOLIO PROFILE PHOTO
    To update the profile photo on the live website:
    1. Save your photo as "profile-photo.jpg".
    2. Place it in your static directory under "/images/profile-photo.jpg".
    3. The component will load it automatically. If it fails, it gracefully
       falls back to the custom designed interactive SVG matrix avatar.
    ==================================================================
  */
  const [profilePhotoSrc] = useState("/images/profile-photo.jpg");
  const [profilePhotoError, setProfilePhotoError] = useState(false);

  /*
    ==================================================================
    DEVELOPER NOTE: ACCENT & THEME CONTROL
    This accent color controls the top visual border of the primary left
    column card as well as secondary highlighted elements. You can 
    adjust this hex value to match any custom brand style.
    ==================================================================
  */
  const [accentColor] = useState("#1A1A1A");

  // Gallery interactive states (Category Filtering & Lightbox sync index)
  const [galleryFilter, setGalleryFilter] = useState<string>("All");
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);

  /*
    ==================================================================
    DEVELOPER NOTE: ACHIEVEMENT LOG & GALLERY
    Below is the complete set of 24 curated, read-only achievements mapping
    exactly to Anuska's local media files (placed under "/images/").
    
    HOW TO EDIT GALLERY CONTENTS:
    - Add, remove, or modify items directly in this array.
    - Fields:
      - id: Unique string identification.
      - title: Brief title of the award, keynote, or workshop.
      - description: Detailed outcome summary outlining technical or leadership impact.
      - image: The path to the image file, e.g., "/images/filename.jpg".
      - tag: Category category ("Research", "Competition", "Speaking", "Leadership", "Experience", "Volunteering", "Hackathon", "Engineering", "Product Design").
      - date: Timeline string (e.g., "Jan 2025").
      - fallback: High-quality curated Unsplash placeholder that loads if the local image is not found.
    ==================================================================
  */
  const galleryItems = [
    {
      id: "award_speech",
      title: "1st Place – SRMIST Ramapuram Oratorical Contest",
      description: "Delivering the championship keynote address. Public presentation has defined her core development philosophy: 'If you cannot articulate what you built, you have not finished building it!'",
      image: "/images/award-speech-competition.jpg",
      tag: "Speaking",
      date: "Sep 2023",
      fallback: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "award_saram",
      title: "2nd Prize – SARAM Expo 2025 ('Mann AI')",
      description: "Receiving the 2nd Prize (Rs. 25,000) for 'Mann AI' mental health platform. The system uses personality-adaptive NLP models customized across 64 psychological profiles.",
      image: "/images/award-saram-expo.jpg",
      tag: "Competition",
      date: "Jan 2025",
      fallback: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "award_oral",
      title: "2nd Place – National Oral Research Presentation",
      description: "Recognized for presenting high-throughput architecture designs and interpretable analytical pipelines at the college-wide research symposium.",
      image: "/images/award-oral-presentation.jpg",
      tag: "Research",
      date: "Oct 2023",
      fallback: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_project_day",
      title: "CryptoGuard OHLCV Pipeline at Project Day",
      description: "Demonstrating the 99.54% accurate cryptocurrency decision tree risk classifier to panel evaluators at SRM Ramapuram Project Day exhibition.",
      image: "/images/gallery-project-day.jpg",
      tag: "Competition",
      date: "May 2026",
      fallback: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_winning_project_day",
      title: "Award-Winning Team at Project Day",
      description: "Standing with the project team after winning top honours for development and design of robust interpretability systems.",
      image: "/images/gallery-winning-project-day.jpg",
      tag: "Competition",
      date: "May 2026",
      fallback: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_texus_speaker",
      title: "Invited Guest Speaker – Texus National Tech Fest",
      description: "Presenting to junior engineering batches on standard web API patterns, secure routing architectures, and database Normalisation concepts.",
      image: "/images/gallery-texus-speaker.jpg",
      tag: "Speaking",
      date: "Mar 2025",
      fallback: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_promptkraft_speaker",
      title: "Keynote Speaker – PromptKraft Developer Workshop",
      description: "Leading a practical training session on structure-bounded LLM development, prompt-injection defense mechanisms, and sentiment-aware UX designs.",
      image: "/images/gallery-promptkraft-speaker.jpg",
      tag: "Speaking",
      date: "Apr 2025",
      fallback: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_web_dev_speaker",
      title: "Lead Instructor – Web Development & API Integration",
      description: "Teaching high-performance client-side state management, responsive CSS setups, and REST API proxying to junior computer science students.",
      image: "/images/gallery-web-dev-speaker.jpg",
      tag: "Speaking",
      date: "Nov 2024",
      fallback: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_ai_cyberquest",
      title: "CyberQuest AI Hackathon - Active Sprints",
      description: "Deploying Python microservices and training random forest prediction engines live under strict 24-hour hackathon deadlines.",
      image: "/images/gallery-ai-cyberquest.jpg",
      tag: "Hackathon",
      date: "Feb 2025",
      fallback: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_google_girl_hackathon",
      title: "Finalist Cohort – Google Girl Hackathon",
      description: "Invited into the selective cohort. Designed highly scalable backend structures, mock-grounded service layers, and failover pathways.",
      image: "/images/gallery-google-girl-hackathon.jpg",
      tag: "Hackathon",
      date: "Mar 2025",
      fallback: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_student_interaction",
      title: "Q&A Discussion – Intellects Club Mentorship",
      description: "Answering student queries regarding system design paradigms, parameterised SQL, database indexing, and enterprise security policies.",
      image: "/images/gallery-student-interaction.jpg",
      tag: "Leadership",
      date: "Jan 2025",
      fallback: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_speaker_again",
      title: "Guest Lecturer – Communicating Technical Solutions",
      description: "Delivering a seminar on connecting raw analytical code to functional human-centric designs at SRM Ramapuram.",
      image: "/images/gallery-speaker-again.jpg",
      tag: "Speaking",
      date: "Aug 2024",
      fallback: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_ngo_work",
      title: "Outreach & Social Campaign - NSS Core",
      description: "Coordinating a localized welfare distribution campaign. Managing participant database sheets and field coordination tasks.",
      image: "/images/gallery-ngo-work.jpg",
      tag: "Volunteering",
      date: "Jul 2025",
      fallback: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_with_team",
      title: "Executive Council – Intellects Club SRM Ramapuram",
      description: "Collaborating with executive leadership to plan the annual academic calendar and configure industrial bootcamps.",
      image: "/images/gallery-with-team.jpg",
      tag: "Leadership",
      date: "May 2024",
      fallback: "https://images.unsplash.com/photo-1552581230-c01bc0d48403?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_trophies",
      title: "Trophies of Academic & Extracurricular Excellence",
      description: "A selection of undergraduate cups and awards acknowledging performance in tech symposiums, design competitions, and public speaking.",
      image: "/images/gallery-trophies.jpg",
      tag: "Competition",
      date: "2023 - 2026",
      fallback: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_first_hackathon",
      title: "First Collegiate Hackathon Experience",
      description: "Exploring backend structures and database models for real-time applications under intense team-based time constraints.",
      image: "/images/gallery-first-hackathon.jpg",
      tag: "Hackathon",
      date: "Dec 2023",
      fallback: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_medals",
      title: "Co-Curricular Debate & Technical Presentation Medals",
      description: "Celebrating multiple top positions in inter-collegiate oratorical, mock-parliament, and backend design challenges.",
      image: "/images/gallery-medals.jpg",
      tag: "Competition",
      date: "2023 - 2026",
      fallback: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_receiving_speech_award",
      title: "Receiving Oratorical Championship First Prize",
      description: "Receiving the first-place prize on stage. Solidifying a foundational belief in clear, expressive, and compelling technical translation.",
      image: "/images/gallery-receiving-speech-award.jpg",
      tag: "Speaking",
      date: "Sep 2023",
      fallback: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_ngo_event",
      title: "Operational Core – NSS Special Outreach Event",
      description: "Coordinating logistical setup, medical camps, and community-awareness surveys for over 1,000 campus participants.",
      image: "/images/gallery-ngo-event.jpg",
      tag: "Volunteering",
      date: "Jun 2024",
      fallback: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_climate_change_speaker",
      title: "Plenary Speaker – Sustainability & AI Integration",
      description: "Delivering a keynote address on how machine learning models like EcoPackAI can estimate and predict product CO2 footprints.",
      image: "/images/gallery-climate-change-speaker.jpg",
      tag: "Speaking",
      date: "May 2024",
      fallback: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_intellects_club",
      title: "Opening Address – Intellects Club Java Bootcamp",
      description: "Addressing the incoming students at the flagship computer science bootcamp. Highlighting the balance of algorithm theory and robust practice.",
      image: "/images/gallery-intellects-club.jpg",
      tag: "Leadership",
      date: "Oct 2024",
      fallback: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_working",
      title: "Core Backend Sprints & Schema Designing",
      description: "Developing secure relational schemas, modeling parameterized queries, and tuning Random Forest classifiers in the lab.",
      image: "/images/gallery-working.jpg",
      tag: "Engineering",
      date: "Ongoing",
      fallback: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_speaking_always",
      title: "Invited Panelist – Modern AI & API Development",
      description: "Discussing modern full-stack engineering, API proxy setups, and prompt engineering parameters at a college-wide technical summit.",
      image: "/images/gallery-speaking-always.jpg",
      tag: "Speaking",
      date: "Dec 2025",
      fallback: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "gallery_launchpad_event",
      title: "Live Beta Exhibition – 'Mann AI' Launchpad",
      description: "Demonstrating the CBT-driven mental health platform live. Managing user data sessions and analyzing live engagement feedbacks.",
      image: "/images/gallery-launchpad-event.jpg",
      tag: "Competition",
      date: "Feb 2025",
      fallback: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    }
  ];

  /*
    ==================================================================
    DEVELOPER NOTE: RESUME GENERATOR & EXPORTER
    This function dynamically serializes the raw 'resumeData' structure
    (from /src/data/resume.ts) into a beautifully formatted professional
    PDF document on-the-fly and triggers an immediate local download.
    This guarantees that the downloaded resume is ALWAYS perfectly synced
    with the latest portfolio updates.
    ==================================================================
  */
  const downloadResume = () => {
    if (customResumeExists) {
      const link = document.createElement("a");
      link.href = "/api/resume/download";
      link.setAttribute("download", "Anuska_Dasgupta_Resume.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const data = resumeData;
    let y = 15;
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;

    // Helper to add a page if we run out of vertical space
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 280) {
        doc.addPage();
        y = 15;
        return true;
      }
      return false;
    };

    // Helper to draw horizontal divider
    const drawDivider = () => {
      y += 2;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    };

    // --- HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text(data.name.toUpperCase(), margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(data.tagline, margin, y);
    y += 6;

    // Contact Grid (3 columns)
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const contactInfo = [
      `Email: ${data.contact.email}`,
      `Phone: ${data.contact.phone}`,
      `Location: ${data.contact.location}`,
      `GitHub: ${data.contact.github.replace("https://", "")}`,
      `LinkedIn: ${data.contact.linkedin.replace("https://", "")}`,
      `LeetCode: ${data.contact.leetcode.replace("https://", "")}`
    ];
    
    const colWidth = contentWidth / 3;
    for (let i = 0; i < contactInfo.length; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const xPos = margin + col * colWidth;
      const yPos = y + row * 4;
      doc.text(contactInfo[i], xPos, yPos);
    }
    y += (Math.ceil(contactInfo.length / 3) * 4) + 4;

    drawDivider();

    // --- PROFESSIONAL SUMMARY ---
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("PROFESSIONAL SUMMARY", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const summaryText = data.summary.join(" ");
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(splitSummary, margin, y);
    y += (splitSummary.length * 4) + 6;

    // --- EDUCATION ---
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("EDUCATION", margin, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text(data.education.degree, margin, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const eduPeriod = data.education.period;
    const eduPeriodWidth = doc.getTextWidth(eduPeriod);
    doc.text(eduPeriod, pageWidth - margin - eduPeriodWidth, y);
    y += 4.5;

    doc.setFont("helvetica", "oblique");
    doc.text(data.education.institution, margin, y);
    doc.setFont("helvetica", "bold");
    const cgpa = data.education.cgpa;
    const cgpaWidth = doc.getTextWidth(cgpa);
    doc.text(cgpa, pageWidth - margin - cgpaWidth, y);
    y += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    const eduDetails = doc.splitTextToSize(data.education.details, contentWidth);
    doc.text(eduDetails, margin, y);
    y += (eduDetails.length * 4) + 6;

    // --- TECHNICAL SKILLS ---
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("TECHNICAL SKILLS", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    data.skills.forEach(skillCat => {
      checkPageBreak(5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`${skillCat.category}:`, margin, y);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const itemsStr = skillCat.items.join(", ");
      const itemsSplit = doc.splitTextToSize(itemsStr, contentWidth - 30);
      doc.text(itemsSplit, margin + 30, y);
      y += (itemsSplit.length * 4) + 1.5;
    });
    y += 5;

    // --- EXPERIENCE ---
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("PROFESSIONAL EXPERIENCE", margin, y);
    y += 5;

    data.experience.forEach(exp => {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      doc.text(`${exp.role} - ${exp.company}`, margin, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      const expPeriod = `${exp.period} (${exp.duration})`;
      const expPeriodWidth = doc.getTextWidth(expPeriod);
      doc.text(expPeriod, pageWidth - margin - expPeriodWidth, y);
      y += 4;

      doc.setFont("helvetica", "oblique");
      doc.setTextColor(100, 100, 100);
      doc.text(`${exp.location} | ${exp.type}`, margin, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      exp.bullets.forEach(bullet => {
        const splitBullet = doc.splitTextToSize(`• ${bullet}`, contentWidth - 4);
        checkPageBreak(splitBullet.length * 4);
        doc.text(splitBullet, margin + 2, y);
        y += (splitBullet.length * 4);
      });
      y += 4;
    });
    y += 2;

    // --- PROJECTS ---
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("KEY PROJECTS", margin, y);
    y += 5;

    data.projects.forEach(proj => {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      doc.text(proj.title, margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      const projPeriod = proj.period;
      const projPeriodWidth = doc.getTextWidth(projPeriod);
      doc.text(projPeriod, pageWidth - margin - projPeriodWidth, y);
      y += 4;

      doc.setFont("helvetica", "oblique");
      doc.setTextColor(100, 100, 100);
      doc.text(`Technologies: ${proj.technologies.join(", ")}`, margin, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      
      const probText = doc.splitTextToSize(`Problem: ${proj.problem}`, contentWidth);
      checkPageBreak(probText.length * 4);
      doc.text(probText, margin, y);
      y += (probText.length * 4) + 1;

      const solText = doc.splitTextToSize(`Solution: ${proj.solution}`, contentWidth);
      checkPageBreak(solText.length * 4);
      doc.text(solText, margin, y);
      y += (solText.length * 4) + 4;
    });

    // --- PUBLICATIONS ---
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("PUBLICATIONS", margin, y);
    y += 5;

    data.publications.forEach(pub => {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text(pub.title, margin, y);
      y += 4;

      doc.setFont("helvetica", "oblique");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`${pub.conference} | ${pub.award}`, margin, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      const pubDetails = doc.splitTextToSize(pub.details, contentWidth);
      checkPageBreak(pubDetails.length * 4);
      doc.text(pubDetails, margin, y);
      y += (pubDetails.length * 4) + 4;
    });

    // Save File
    doc.save(`${data.name.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  // Handle Project Expansion Toggle
  const toggleProject = (title: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Filter Projects
  const filteredProjects = resumeData.projects.filter(p => {
    if (projectFilter === "All") return true;
    
    if (projectFilter === "AI/ML") {
      return p.technologies.some(tech => {
        const t = tech.toLowerCase();
        return t.includes("decision") || t.includes("forest") || t.includes("xgboost") || 
               t.includes("gemini") || t.includes("nlp") || t.includes("learn") || 
               t.includes("prompt") || t.includes("shap") || p.title.toLowerCase().includes("ai");
      });
    }
    
    if (projectFilter === "Backend/Full-stack") {
      return p.technologies.some(tech => {
        const t = tech.toLowerCase();
        return t.includes("react") || t.includes("typescript") || t.includes("node") || 
               t.includes("express") || t.includes("api") || t.includes("java") || 
               t.includes("flask") || t.includes("spring") || t.includes("jdbc");
      });
    }
    
    if (projectFilter === "Databases/SQL") {
      return p.technologies.some(tech => {
        const t = tech.toLowerCase();
        return t.includes("sql") || t.includes("postgres") || t.includes("mysql") || 
               t.includes("jdbc") || t.includes("schema") || t.includes("database");
      });
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-neutral-900/10 selection:text-neutral-900 flex flex-col">
      
      {/* Delicate Top Border/Accent Accent Line */}
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: accentColor }} />

      {/* Navigation Header */}
      <header className="px-6 md:px-12 py-8 border-b border-brand-border bg-brand-bg/95 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-base font-extrabold tracking-[0.2em] uppercase text-brand-text">
              ANUSKA DASGUPTA
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold tracking-[0.15em] uppercase text-brand-muted">
            <button
              onClick={() => setActiveTab("projects")}
              className={`cursor-pointer hover:text-brand-text transition-colors pb-1 border-b ${activeTab === "projects" ? "border-brand-text text-brand-text" : "border-transparent"}`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`cursor-pointer hover:text-brand-text transition-colors pb-1 border-b ${activeTab === "experience" ? "border-brand-text text-brand-text" : "border-transparent"}`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`cursor-pointer hover:text-brand-text transition-colors pb-1 border-b ${activeTab === "skills" ? "border-brand-text text-brand-text" : "border-transparent"}`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`cursor-pointer hover:text-brand-text transition-colors pb-1 border-b ${activeTab === "academic" ? "border-brand-text text-brand-text" : "border-transparent"}`}
            >
              Publications & Certs
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`cursor-pointer hover:text-brand-text transition-colors pb-1 border-b ${activeTab === "gallery" ? "border-brand-text text-brand-text" : "border-transparent"}`}
            >
              Gallery
            </button>
          </nav>

          {/* Mobile Menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-brand-text rounded-lg border border-brand-border bg-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-brand-bg border-b border-brand-border z-20 px-6 py-6 flex flex-col space-y-3 shrink-0"
          >
            <button
              onClick={() => { setActiveTab("projects"); setIsMobileMenuOpen(false); }}
              className={`w-full py-2.5 rounded-lg text-left px-4 text-xs font-bold tracking-widest uppercase ${activeTab === "projects" ? "bg-brand-text text-brand-bg" : "text-brand-text bg-white border border-brand-border"}`}
            >
              Projects
            </button>
            <button
              onClick={() => { setActiveTab("experience"); setIsMobileMenuOpen(false); }}
              className={`w-full py-2.5 rounded-lg text-left px-4 text-xs font-bold tracking-widest uppercase ${activeTab === "experience" ? "bg-brand-text text-brand-bg" : "text-brand-text bg-white border border-brand-border"}`}
            >
              Experience
            </button>
            <button
              onClick={() => { setActiveTab("skills"); setIsMobileMenuOpen(false); }}
              className={`w-full py-2.5 rounded-lg text-left px-4 text-xs font-bold tracking-widest uppercase ${activeTab === "skills" ? "bg-brand-text text-brand-bg" : "text-brand-text bg-white border border-brand-border"}`}
            >
              Skills
            </button>
            <button
              onClick={() => { setActiveTab("academic"); setIsMobileMenuOpen(false); }}
              className={`w-full py-2.5 rounded-lg text-left px-4 text-xs font-bold tracking-widest uppercase ${activeTab === "academic" ? "bg-brand-text text-brand-bg" : "text-brand-text bg-white border border-brand-border"}`}
            >
              Publications & Certs
            </button>
            <button
              onClick={() => { setActiveTab("gallery"); setIsMobileMenuOpen(false); }}
              className={`w-full py-2.5 rounded-lg text-left px-4 text-xs font-bold tracking-widest uppercase ${activeTab === "gallery" ? "bg-brand-text text-brand-bg" : "text-brand-text bg-white border border-brand-border"}`}
            >
              Gallery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Hand: Profile Column (Span 4) */}
        <aside className="lg:col-span-4 flex flex-col space-y-8">
          
          {/* Main Card with premium neutral styling */}
          <div className="bg-white border border-brand-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: accentColor }} />
            
            {/* Name, Details & Photo Row */}
            <div className="flex items-start justify-between gap-4 mb-6">
              
              {/* Name & Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block mb-1">Software & ML Engineer</span>
                <h2 className="text-2xl font-light tracking-tight text-brand-text leading-tight">{resumeData.name}</h2>
                <p className="text-xs text-brand-muted font-mono mt-1.5 tracking-wide">Final Year B.Tech CSE Student</p>
                <p className="text-[10px] text-neutral-400 font-mono mt-1 uppercase tracking-wider">SRMIST '27</p>
                
                {/* Download Resume Action */}
                <div className="mt-4">
                  <button
                    onClick={downloadResume}
                    className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-brand-border bg-brand-bg hover:bg-neutral-100 text-[10px] font-bold tracking-widest uppercase text-brand-text transition-all duration-300 shadow-sm cursor-pointer group/btn"
                    title="Download PDF Resume"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-muted group-hover/btn:text-brand-text transition-colors" />
                    <span>Get Resume</span>
                  </button>
                  {customResumeExists && (
                    <p className="text-[9px] text-zinc-400 font-mono mt-1.5 ml-1">
                      ✓ Latest PDF Resume
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Photo - Static layout with fallback SVG */}
              <div 
                className="relative w-24 h-24 shrink-0 rounded-2xl border border-brand-border overflow-hidden bg-brand-bg/40 flex items-center justify-center group"
                id="profile-photo-container"
              >
                {!profilePhotoError ? (
                  <img 
                    src={profilePhotoSrc} 
                    alt={resumeData.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    onError={() => setProfilePhotoError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full p-2 flex flex-col items-center justify-center relative">
                    <div className="w-4/5 h-4/5">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-brand-muted group-hover:text-brand-text transition-colors duration-500">
                        <defs>
                          <pattern id="dotGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="0.6" fill="currentColor" opacity="0.15" />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#dotGrid)" rx="16" />
                        
                        <g opacity="0.25">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
                          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.25" />
                          <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="0.2" />
                          <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="0.2" />
                        </g>

                        <g className="translate-y-2">
                          <circle cx="50" cy="32" r="11" fill="none" stroke="currentColor" strokeWidth="1" />
                          <path d="M 44 32 L 48 32 M 52 32 L 56 32 M 48 32 L 52 32" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                          <path d="M 48 37 Q 50 39 52 37" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" fill="none" />
                          <path d="M 28 70 C 28 58, 38 52, 50 52 C 62 52, 72 58, 72 70" fill="none" stroke="currentColor" strokeWidth="1" />
                          <text x="50" y="63" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="currentColor" opacity="0.8" className="font-bold">
                            {"<ML />"}
                          </text>
                        </g>

                        <circle cx="50" cy="50" r="48" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.1" className="group-hover:opacity-100 transition-opacity duration-300" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Core tagline/mission */}
            <div className="my-6 border-t border-brand-border pt-6">
              <span className="block text-[9px] font-mono tracking-widest text-brand-muted uppercase mb-3">Philosophy</span>
              <p className="text-sm text-brand-text font-light leading-relaxed italic">
                "{resumeData.summary[0]}"
              </p>
              <p className="text-xs text-brand-muted mt-2 font-mono leading-relaxed">
                — {resumeData.summary[1]}
              </p>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-4 my-6 border-t border-brand-border pt-6">
              <div>
                <span className="block text-[9px] font-mono tracking-widest text-brand-muted uppercase mb-1">Scholarship</span>
                <span className="text-2xl font-light text-brand-text block">9.57 / 10.0</span>
                <span className="text-[10px] text-brand-muted font-mono">Top 5% Cohort</span>
              </div>
              <div>
                <span className="block text-[9px] font-mono tracking-widest text-brand-muted uppercase mb-1">Distinction</span>
                <span className="text-2xl font-light text-brand-text block">Best Paper</span>
                <span className="text-[10px] text-brand-muted font-mono">ICARECS 2026</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3.5 border-t border-brand-border pt-6">
              <span className="block text-[9px] font-mono tracking-widest text-brand-muted uppercase mb-1">Channels & Location</span>
              
              <div className="flex items-center space-x-3 text-xs text-brand-text">
                <Mail className="w-4 h-4 text-brand-muted shrink-0" />
                <a href={`mailto:${resumeData.contact.email}`} className="font-mono hover:underline">{resumeData.contact.email}</a>
              </div>
              <div className="flex items-center space-x-3 text-xs text-brand-text">
                <Phone className="w-4 h-4 text-brand-muted shrink-0" />
                <span className="font-mono">{resumeData.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-brand-text">
                <MapPin className="w-4 h-4 text-brand-muted shrink-0" />
                <span>Chennai, India (Open to Relocation)</span>
              </div>
            </div>

            {/* Portal links */}
            <div className="grid grid-cols-3 gap-2 border-t border-brand-border mt-6 pt-6 text-center">
              <a 
                href={resumeData.contact.github} 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-bg hover:bg-zinc-100 p-3 rounded-xl border border-brand-border transition-all flex flex-col items-center space-y-1.5"
              >
                <Github className="w-4 h-4 text-brand-text" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-brand-muted">GitHub</span>
              </a>
              <a 
                href={resumeData.contact.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-bg hover:bg-zinc-100 p-3 rounded-xl border border-brand-border transition-all flex flex-col items-center space-y-1.5"
              >
                <Linkedin className="w-4 h-4 text-brand-text" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-brand-muted">LinkedIn</span>
              </a>
              <a 
                href={resumeData.contact.leetcode} 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-bg hover:bg-zinc-100 p-3 rounded-xl border border-brand-border transition-all flex flex-col items-center space-y-1.5"
              >
                <Code className="w-4 h-4 text-brand-text" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-brand-muted">LeetCode</span>
              </a>
            </div>
          </div>

          {/* Education Box */}
          <div className="bg-white border border-brand-border rounded-2xl p-8">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-brand-muted mb-4 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-brand-text" />
              <span>Academic Foundation</span>
            </h3>
            
            <div className="pl-4 border-l border-brand-border space-y-1">
              <span className="text-[10px] font-mono text-brand-muted block">{resumeData.education.period}</span>
              <h4 className="font-bold text-sm text-brand-text">{resumeData.education.degree}</h4>
              <p className="text-xs text-brand-muted">{resumeData.education.institution}</p>
              <p className="text-xs text-brand-text font-semibold font-mono mt-1">{resumeData.education.cgpa}</p>
              <p className="text-[11px] text-brand-muted mt-2 leading-relaxed">{resumeData.education.details}</p>
            </div>
          </div>

        </aside>

        {/* Right Hand Column: Primary tabs & details explorer (Span 8) */}
        <main ref={mainContentRef} className="lg:col-span-8 flex flex-col space-y-8 scroll-mt-28">
          
          {/* Large Hero Title - Elegant, light typography (Key Clean Minimalism element) */}
          {activeTab === "projects" && (
            <section className="mb-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] text-brand-text">
                Building robust backend architectures <br />
                <span className="italic text-brand-muted">with explainable AI workflows</span> <br />
                and production-ready pipelines.
              </h1>
              <p className="text-sm md:text-base text-brand-muted max-w-2xl mt-6 leading-relaxed font-light">
                Final-year B.Tech CSE student specializing in Python, Java, Spring Boot, and machine learning models. Built 6 deployed projects solo with a focus on explainable decision trees, parameterised query performance, and user welfare safeguards.
              </p>
            </section>
          )}

          {/* TAB 1: Projects Explorer */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              
              {/* Filter controls - High Contrast Clean Styling */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none border-y border-brand-border py-4">
                {["All", "AI/ML", "Backend/Full-stack", "Databases/SQL"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setProjectFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${projectFilter === filter ? "bg-brand-text text-brand-bg" : "text-brand-muted hover:text-brand-text bg-transparent"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Recent Highlights marker */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="h-[1px] w-8 bg-brand-text"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                  Selected Work Showcase
                </span>
              </div>

              {/* Projects List */}
              <div className="space-y-6">
                {filteredProjects.length === 0 ? (
                  <div className="border border-brand-border rounded-2xl p-12 text-center bg-white">
                    <p className="text-brand-muted text-xs">No projects match the selected filters.</p>
                    <button 
                      onClick={() => { setProjectFilter("All"); }}
                      className="mt-2 text-xs text-brand-text font-bold uppercase tracking-wider underline decoration-1"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredProjects.map((project, idx) => {
                    const isExpanded = !!expandedProjects[project.title];
                    return (
                      <motion.div 
                        layout="position"
                        key={project.title}
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-white border border-brand-border hover:border-zinc-400 rounded-2xl p-8 transition-all relative overflow-hidden"
                      >
                        {/* Award marker */}
                        {project.awards && (
                          <div className="absolute top-0 right-0 bg-neutral-900 text-brand-bg px-3.5 py-1 text-[9px] font-mono tracking-widest uppercase font-semibold">
                            {project.awards}
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block">{project.period}</span>
                            <h3 
                              className="text-xl font-medium tracking-tight text-brand-text hover:text-brand-muted transition-colors cursor-pointer mt-1" 
                              onClick={() => toggleProject(project.title)}
                            >
                              {project.title}
                            </h3>
                          </div>
                        </div>

                        {/* Monospace Technology Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5 mb-5">
                          {project.technologies.map(tech => (
                            <span key={tech} className="bg-brand-bg text-brand-text border border-brand-border/60 px-2 py-0.5 rounded text-[9px] font-mono tracking-tight">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Problem-Solution Stack with crisp minimalist spacing */}
                        <div className="space-y-4">
                          <div className="border-l border-zinc-300 pl-4 py-0.5">
                            <span className="text-[9px] text-brand-muted font-mono uppercase tracking-widest block mb-1">Problem Statement</span>
                            <p className="text-xs text-brand-text leading-relaxed font-light">{project.problem}</p>
                          </div>

                          {isExpanded ? (
                            <div className="border-l border-brand-text pl-4 py-0.5 bg-brand-bg/40 p-4 rounded-r-xl">
                              <span className="text-[9px] text-brand-text font-mono uppercase tracking-widest block mb-1 font-bold">Engineering Implementation</span>
                              <p className="text-xs text-brand-text leading-relaxed whitespace-pre-line font-light">{project.solution}</p>
                            </div>
                          ) : (
                            <button 
                              onClick={() => toggleProject(project.title)}
                              className="text-[10px] text-brand-text hover:text-brand-muted flex items-center space-x-1.5 mt-2 font-bold tracking-widest uppercase group"
                            >
                              <span>View complete engineering solution</span>
                              <ChevronDown className="w-3.5 h-3.5 text-brand-text group-hover:translate-y-0.5 transition-transform" />
                            </button>
                          )}

                          {isExpanded && (
                            <button 
                              onClick={() => toggleProject(project.title)}
                              className="text-[10px] text-brand-muted hover:text-brand-text flex items-center space-x-1.5 mt-2 font-bold tracking-widest uppercase"
                            >
                              <span>Collapse implementation details</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Flat Minimal Link row */}
                        <div className="flex items-center space-x-5 mt-6 border-t border-brand-border pt-5">
                          {project.github && (
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] font-bold tracking-widest uppercase text-brand-text hover:text-brand-muted flex items-center space-x-1.5 group"
                            >
                              <Github className="w-4 h-4 text-brand-muted shrink-0" />
                              <span>View Source</span>
                              <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </a>
                          )}
                          {project.live && (
                            <a 
                              href={project.live} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] font-bold tracking-widest uppercase text-brand-text hover:text-brand-muted flex items-center space-x-1.5 group"
                            >
                              <ExternalLink className="w-4 h-4 text-brand-muted shrink-0" />
                              <span>Live Application</span>
                              <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Experience & Leadership Roadmap */}
          {activeTab === "experience" && (
            <div className="space-y-10">
              
              {/* Internship Sections */}
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-[1px] w-8 bg-brand-text"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                    Professional Experience
                  </span>
                </div>
                
                <div className="space-y-6 relative border-l border-brand-border pl-8 ml-3">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.company} className="relative">
                      {/* Simple crisp marker dot */}
                      <div className="absolute top-1.5 left-[-37px] h-4 w-4 rounded-full bg-white border border-brand-text flex items-center justify-center font-mono text-[8px] text-brand-text font-bold">
                        •
                      </div>
                      
                      <div className="bg-white border border-brand-border rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-1">
                          <div>
                            <span className="text-[9px] font-mono text-brand-muted block uppercase tracking-widest">{exp.period} • {exp.duration}</span>
                            <h4 className="text-lg font-medium tracking-tight text-brand-text mt-0.5">{exp.role}</h4>
                            <p className="text-xs text-brand-muted font-mono mt-1">{exp.company} • {exp.location}</p>
                          </div>
                        </div>
                        
                        <ul className="space-y-3 mt-4 border-t border-brand-border pt-4">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="text-xs text-brand-text leading-relaxed flex items-start space-x-2 font-light">
                              <div className="mt-2 h-1 w-1 rounded-full bg-brand-text shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leadership Roles */}
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-[1px] w-8 bg-brand-text"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                    Leadership & Community
                  </span>
                </div>
                
                <div className="space-y-6 relative border-l border-brand-border pl-8 ml-3">
                  {resumeData.leadership.map((lead) => (
                    <div key={lead.organization} className="relative">
                      <div className="absolute top-1.5 left-[-37px] h-4 w-4 rounded-full bg-white border border-brand-text flex items-center justify-center font-mono text-[8px] text-brand-text font-bold">
                        L
                      </div>
                      
                      <div className="bg-white border border-brand-border rounded-xl p-6">
                        <div className="mb-4">
                          <span className="text-[9px] font-mono text-brand-muted block uppercase tracking-widest">{lead.period}</span>
                          <h4 className="text-lg font-medium tracking-tight text-brand-text mt-0.5">{lead.role}</h4>
                          <p className="text-xs text-brand-muted font-mono mt-1">{lead.organization}</p>
                        </div>
                        
                        <ul className="space-y-3 mt-4 border-t border-brand-border pt-4">
                          {lead.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="text-xs text-brand-text leading-relaxed flex items-start space-x-2 font-light">
                              <div className="mt-2 h-1 w-1 rounded-full bg-brand-text shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Skills Matrix */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              
              {/* Introduction & Search Controls */}
              <div className="bg-white border border-brand-border rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="h-[1px] w-8 bg-brand-text"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                        Technical Skills Matrix
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed font-light max-w-xl">
                      Interactive skills dashboard showing her key software competencies mapped directly to their execution context in her deployed projects.
                    </p>
                  </div>
                </div>

                {/* Real-time search bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search stack (e.g. Python, SQL, NLP, Spring Boot...)"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand-text transition-all font-mono placeholder-zinc-400"
                  />
                  {skillSearch && (
                    <button 
                       onClick={() => setSkillSearch("")}
                       className="absolute right-3.5 top-3 text-[10px] text-brand-muted hover:text-brand-text font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Split Panel Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Dynamic list of categories and skills (Span 7) */}
                <div className="lg:col-span-7 space-y-6">
                  {resumeData.skills.map((category) => {
                    // Filter skills belonging to this category
                    const matchedSkills = category.items.filter((skill) => {
                      return skill.toLowerCase().includes(skillSearch.toLowerCase());
                    });

                    if (matchedSkills.length === 0) return null;

                    return (
                      <div key={category.category} className="bg-white border border-brand-border rounded-2xl p-6">
                        <h4 className="font-extrabold text-[10px] uppercase tracking-[0.18em] text-brand-text border-b border-brand-border pb-3 mb-4">
                          {category.category}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {matchedSkills.map((skill) => {
                            const isCurrentlyHovered = hoveredSkill === skill;

                            return (
                              <div
                                key={skill}
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                className={`p-3.5 rounded-xl border transition-all cursor-crosshair flex items-center justify-between ${
                                  isCurrentlyHovered 
                                    ? "border-neutral-900 bg-neutral-50 scale-[1.01] shadow-sm" 
                                    : "border-brand-border bg-white"
                                }`}
                              >
                                <span className="text-xs font-mono font-bold text-brand-text">{skill}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Visual Context Inspector Pane (Span 5) */}
                <div className="lg:col-span-5">
                  <div className="bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-2xl p-8 sticky top-28 h-[380px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: accentColor }} />
                    
                    {hoveredSkill ? (
                      <div className="space-y-6">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
                            Inspecting node
                          </span>
                          <h4 className="text-2xl font-light text-white tracking-tight">{hoveredSkill}</h4>
                        </div>

                        {/* Real world context statement */}
                        <div className="border-t border-neutral-800 pt-5">
                          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block mb-2">
                            Implementation Scope
                          </span>
                          <p className="text-xs text-neutral-300 leading-relaxed font-light">
                            {skillContexts[hoveredSkill] || "Used as an essential building block in her development architecture, standard tooling conventions, or academic coursework."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-full">
                          <Cpu className="w-6 h-6 text-neutral-500 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-1">Interactive Node Inspector</h4>
                          <p className="text-xs text-neutral-500 font-light max-w-xs leading-relaxed">
                            Hover over any skill tag on the left column to decode its specific real-world integration context.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Visual schematic decoration at the bottom */}
                    <div className="border-t border-neutral-800 pt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>SYSTEM_DECODE: ACTIVE</span>
                      <span>SRMIST_CSE_CORE</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: Publications & Certs */}
          {activeTab === "academic" && (
            <div className="space-y-8">
              
              {/* Publications Panel */}
              <div className="bg-white border border-brand-border rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-[1px] w-8 bg-brand-text"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                    Academic Research & Publications
                  </span>
                </div>
                
                {resumeData.publications.map((pub) => (
                  <div key={pub.title} className="bg-brand-bg/60 border border-brand-border p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-text text-brand-bg px-3 py-1 text-[8px] font-mono tracking-widest uppercase font-semibold">
                      {pub.award}
                    </div>

                    <span className="text-[9px] text-brand-muted font-mono font-semibold uppercase block mb-1">{pub.conference}</span>
                    <h4 className="text-base font-medium tracking-tight text-brand-text mt-1 leading-snug">{pub.title}</h4>
                    <p className="text-xs text-brand-muted mt-3 leading-relaxed font-light">{pub.details}</p>
                  </div>
                ))}
              </div>

              {/* Certifications Panel */}
              <div className="bg-white border border-brand-border rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-[1px] w-8 bg-brand-text"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                    Professional Certifications
                  </span>
                </div>
                
                {resumeData.certifications.map((cert) => (
                  <div key={cert.name} className="flex flex-col sm:flex-row sm:items-start justify-between bg-brand-bg/60 border border-brand-border p-6 rounded-xl gap-3">
                    <div>
                      <span className="text-[9px] font-mono text-brand-muted block uppercase tracking-widest">{cert.period}</span>
                      <h4 className="text-base font-medium tracking-tight text-brand-text mt-1 leading-snug">{cert.name}</h4>
                      <p className="text-xs text-brand-muted mt-0.5">{cert.issuer} • <span className="text-brand-text font-mono font-semibold">{cert.grade}</span></p>
                      <p className="text-xs text-brand-text mt-3 leading-relaxed font-light">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Interactive Achievement Gallery */}
          {activeTab === "gallery" && (
            <div className="space-y-8">
              
              {/* Header & Filter Row */}
              <div className="bg-white border border-brand-border rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="h-[1px] w-8 bg-brand-text"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text">
                        Visual Achievement Log & Gallery
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted font-light leading-relaxed max-w-xl">
                      A dynamic timeline showcasing her public speaking milestones, academic research presentations, leadership bootcamps, and hackathon milestones.
                    </p>
                  </div>
                </div>

                {/* Filter chips container */}
                <div className="flex items-center space-x-1.5 mt-8 overflow-x-auto scrollbar-none border-t border-brand-border pt-6">
                  {["All", "Research", "Competition", "Speaking", "Leadership", "Experience", "Volunteering", "Hackathon", "Design/Engineering"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setGalleryFilter(tag)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all shrink-0 cursor-pointer ${
                        galleryFilter === tag 
                          ? "bg-brand-text text-brand-bg shadow-sm" 
                          : "text-brand-muted hover:text-brand-text bg-brand-bg/50 hover:bg-brand-bg border border-brand-border/40"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive 3-Column Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryItems
                  .filter(item => {
                    if (galleryFilter === "All") return true;
                    if (galleryFilter === "Design/Engineering") {
                      return item.tag === "Product Design" || item.tag === "Engineering";
                    }
                    return item.tag === galleryFilter;
                  })
                  .map((item, index) => {
                    // Find actual index in complete array for lightbox sync
                    const globalIdx = galleryItems.findIndex(g => g.id === item.id);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border border-brand-border rounded-2xl overflow-hidden group hover:border-zinc-400 hover:shadow-md transition-all duration-300 flex flex-col relative"
                      >
                        {/* Image Frame with hover zoom */}
                        <div 
                          className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 cursor-zoom-in relative"
                          onClick={() => setSelectedGalleryImage(globalIdx)}
                        >
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = item.fallback;
                            }}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/95 backdrop-blur-sm border border-brand-border text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg text-brand-text shadow-sm">
                              Enlarge View
                            </span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-brand-muted bg-brand-bg px-2.5 py-0.5 rounded-md border border-brand-border/40">
                                {item.tag}
                              </span>
                              <span className="text-[9px] font-mono text-brand-muted">{item.date}</span>
                            </div>
                            <h4 className="text-sm font-semibold tracking-tight text-brand-text mt-1 group-hover:text-neutral-950 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-brand-muted mt-2.5 leading-relaxed font-light line-clamp-3">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              {/* Dynamic Empty State */}
              {galleryItems.filter(item => {
                if (galleryFilter === "All") return true;
                if (galleryFilter === "Design/Engineering") {
                  return item.tag === "Product Design" || item.tag === "Engineering";
                }
                return item.tag === galleryFilter;
              }).length === 0 && (
                <div className="bg-white border border-brand-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-brand-muted mb-4 animate-pulse" />
                  <h4 className="font-bold text-sm text-brand-text uppercase tracking-wider">No achievements logged in this category</h4>
                  <p className="text-xs text-brand-muted mt-2 max-w-sm leading-relaxed font-light">
                    Select another category tag from the filter above to explore her portfolio milestone cards!
                  </p>
                </div>
              )}

              {/* Immersive Fullscreen Lightbox / Modal with controls and animation */}
              <AnimatePresence>
                {selectedGalleryImage !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setSelectedGalleryImage(null)}
                  >
                    {/* Escape Key & Arrow Listener hook inside lightbox */}
                    <LightboxKeyboardHelper 
                      onClose={() => setSelectedGalleryImage(null)}
                      onPrev={() => setSelectedGalleryImage(prev => {
                        if (prev === null) return null;
                        return prev === 0 ? galleryItems.length - 1 : prev - 1;
                      })}
                      onNext={() => setSelectedGalleryImage(next => {
                        if (next === null) return null;
                        return next === galleryItems.length - 1 ? 0 : next + 1;
                      })}
                    />

                    {/* Lightbox Wrapper Card */}
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="bg-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Image column (takes remaining) */}
                      <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group">
                        <img 
                          src={galleryItems[selectedGalleryImage].image} 
                          alt={galleryItems[selectedGalleryImage].title}
                          className="max-h-[50vh] md:max-h-[80vh] w-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = galleryItems[selectedGalleryImage].fallback;
                          }}
                          referrerPolicy="no-referrer"
                        />

                        {/* Slide Left Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGalleryImage(prev => {
                              if (prev === null) return null;
                              return prev === 0 ? galleryItems.length - 1 : prev - 1;
                            });
                          }}
                          className="absolute left-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer shadow-md opacity-70 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Slide Right Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGalleryImage(next => {
                              if (next === null) return null;
                              return next === galleryItems.length - 1 ? 0 : next + 1;
                            });
                          }}
                          className="absolute right-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer shadow-md opacity-70 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Detail Column (fixed width on desktop) */}
                      <div className="w-full md:w-[320px] bg-white p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-brand-border">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-brand-muted bg-brand-bg px-2.5 py-0.5 rounded-md border border-brand-border/40">
                              {galleryItems[selectedGalleryImage].tag}
                            </span>
                            <span className="text-[9px] font-mono text-brand-muted">{galleryItems[selectedGalleryImage].date}</span>
                          </div>

                          <h3 className="text-lg font-semibold tracking-tight text-brand-text">
                            {galleryItems[selectedGalleryImage].title}
                          </h3>
                          
                          <p className="text-xs text-brand-muted mt-4 leading-relaxed font-light">
                            {galleryItems[selectedGalleryImage].description}
                          </p>
                        </div>

                        {/* Action buttons footer */}
                        <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between">
                          <span className="text-[9px] font-mono text-brand-muted">
                            {selectedGalleryImage + 1} of {galleryItems.length}
                          </span>
                          <button
                            onClick={() => setSelectedGalleryImage(null)}
                            className="px-4 py-2 bg-brand-text text-brand-bg rounded-lg text-[9px] font-bold tracking-wider uppercase hover:opacity-90 transition-all cursor-pointer"
                          >
                            Close View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </main>
      </div>



      {/* Footer styled perfectly according to Clean Minimalism specs */}
      <footer className="px-6 md:px-12 py-12 border-t border-brand-border bg-white flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase text-brand-muted shrink-0 gap-6">
        <div>© {new Date().getFullYear()} Anuska Dasgupta Portfolio</div>
        <div className="flex space-x-8">
          <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-brand-text transition-colors">LinkedIn</a>
          <a href={resumeData.contact.github} target="_blank" rel="noreferrer" className="hover:text-brand-text transition-colors">GitHub</a>
          <a href={`mailto:${resumeData.contact.email}`} className="hover:text-brand-text transition-colors">Email</a>
        </div>
      </footer>

      {/* Hidden Developer Customization Console (Slide-over Drawer) */}
      <DevConsole isOpen={isDevConsoleOpen} onClose={() => setIsDevConsoleOpen(false)} />

    </div>
  );
}
