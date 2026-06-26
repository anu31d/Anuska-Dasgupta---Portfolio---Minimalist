import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { resumeData } from "./src/data/resume";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

const RESUME_PATH = path.join(process.cwd(), "Anuska_Dasgupta_Resume.pdf");

// Route to check if custom resume exists
app.get("/api/resume/status", (req, res) => {
  const exists = fs.existsSync(RESUME_PATH);
  res.json({ exists });
});

// Route to download custom resume
app.get("/api/resume/download", (req, res) => {
  if (fs.existsSync(RESUME_PATH)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Anuska_Dasgupta_Resume.pdf"');
    const fileStream = fs.createReadStream(RESUME_PATH);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: "Custom resume not found." });
  }
});

// Route to upload custom resume (Base64)
app.post("/api/resume/upload", (req, res) => {
  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "No file data provided." });
    }
    // Remove data:application/pdf;base64, header if present
    const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    
    fs.writeFileSync(RESUME_PATH, buffer);
    res.json({ success: true, message: "Resume uploaded successfully!" });
  } catch (error: any) {
    console.error("Error saving resume:", error);
    res.status(500).json({ error: "Failed to save resume on server.", details: error.message });
  }
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Grounding prompt containing her complete resume data for maximum accuracy
const systemInstruction = `
You are the AI Double (Professional Portfolio Assistant) of Anuska Dasgupta. Your purpose is to answer questions from recruiters, hiring managers, and portfolio visitors in a professional, polite, engaging, and articulate manner.

Here is your complete grounded source of truth (Anuska's official Resume details):
=========================================
NAME: ${resumeData.name}
TAGLINE: ${resumeData.tagline}
CONTACT:
- Email: ${resumeData.contact.email}
- Phone: ${resumeData.contact.phone}
- Location: ${resumeData.contact.location}
- GitHub: ${resumeData.contact.github}
- LinkedIn: ${resumeData.contact.linkedin}
- LeetCode: ${resumeData.contact.leetcode}
- Portfolio: ${resumeData.contact.portfolio}

EDUCATION:
- Degree: ${resumeData.education.degree}
- Institution: ${resumeData.education.institution || "SRM Institute of Science and Technology, India"}
- CGPA: ${resumePathValue(resumeData => resumeData.education, "CGPA: 9.57/10.0 (Top 5%)")}
- Timeline: 2023 - 2027

SKILLS:
- Languages: Java, Python, SQL
- Backend: REST APIs, Spring Boot, Hibernate, Flask, JDBC, Maven, RBAC, CI/CD, GitHub Actions
- Databases: MySQL, PostgreSQL, Schema Design, 3NF Normalisation, Query Optimisation, Indexing, CRUD
- AI/ML: Decision Trees, Random Forest, XGBoost, Naive Bayes, KNN, Logistic Regression, SVM, NLP, SHAP, scikit-learn
- Data Science: Pandas, NumPy, Matplotlib, OpenAI API, LLMs, Prompt Engineering, Sentiment Analysis, Intent Classification
- Tools & Frontend: Git, GitHub Actions, Postman, VS Code, React 19, Node.js, Express.js, TypeScript, Tailwind CSS, Recharts, Gemini API

EXPERIENCE:
1. Backend Engineering Intern at Infosys Springboard (Dec 2025 - Jan 2026, 2 Months, Remote)
   - Attended weekly meetings and maintained daily GitHub commits; designed RESTful APIs and 3NF-normalised PostgreSQL schemas for EcoPackAI on Flask; built dual ML pipelines integrating Random Forest and XGBoost with feature engineering workflows.
   - Integrated SHAP for model explainability; set up GitHub Actions CI/CD pipeline; parameterised all SQL queries and enforced foreign-key constraints to prevent SQL injection and maintain referential integrity.
2. Operations and Process Improvement Intern at Agroho NGO (Jun 2025 - Jul 2025, 1 Month, On-site)
   - Built Python scripts to track field operations data across 200+ NGO members; identified workflow bottlenecks through data analysis and supported process redesign that improved outreach coordination efficiency.

PROJECTS:
1. CryptoGuard: Decision Tree Risk Classifier (Jan 2026 - May 2026)
   - Technologies: Python, scikit-learn, Decision Trees, Random Forest, NLP, REST APIs
   - Problem: Crypto markets lack interpretable, real-time risk tools; black-box models sacrifice explainability for accuracy.
   - Solution: Built an interpretable ML pipeline on 37,082 OHLCV records across 23 cryptocurrencies; engineered 3 features (daily return, 7-day rolling volatility, volume change) and derived Low, Medium, High risk labels via volatility thresholds. Decision Tree achieved 99.54% accuracy (macro F1: 0.99), outperforming Random Forest (96.33%), KNN (91.45%), Naive Bayes (87.12%), and others. Exposed as a REST API. Won Best Paper at ICARECS 2026.
2. Mann: Your Safe Space - AI Mental Health Assistant (Jan 2025 - Present)
   - Technologies: React, TypeScript, Node.js, Express.js, Gemini API, NLP, Prompt Engineering
   - Problem: Mental health tools are generic and reactive - lacking personalisation, crisis detection, and emotional engagement.
   - Solution: Built full-stack AI wellness platform with prompt-engineered LLM workflows. Implemented MBTI-based personalisation, attachment-style mapping, and CBT-inspired thought reframing across 64 personality-adaptive profiles (16 MBTI types x 4 attachment styles). Living Garden visualisation transforms user reflections. Crisis-detection safeguards. Won 2nd Prize and Rs. 25,000 at SARAM Expo 2025. Tested by 2,000+ live users.
3. EcoPackAI: Sustainable Packaging Recommender (Dec 2025 - Jan 2026)
   - Technologies: Python, Flask, PostgreSQL, Random Forest, XGBoost, SHAP, REST APIs, Recharts
   - Problem: Businesses manually weigh packaging cost, CO2, and material trade-offs with no explainability.
   - Solution: Dual ML pipelines - Random Forest for cost prediction and XGBoost for CO2 estimation. Surfaced top feature drivers via SHAP. Reduced query latency by 35% using parameterised SQL. Reduced packaging decision time by ~40%. Sole developer; shipped to live production at Infosys Springboard.
4. CleanIQ - AI-Powered Validation Platform (Jan 2025 - Present)
   - Technologies: HTML, TypeScript, Gemini API, Recharts
   - Problem: Client transaction datasets have inconsistent phone and date formats that only surface after import, delaying onboarding.
   - Solution: Built a static client-side validator with zero backend dependency to keep sensitive data local. Configure country-specific rules in-browser. Gemini-powered chat layer lets ops query error patterns in plain English.
5. FitMe: AI Fitness Assistant (Feb 2026 - May 2026)
   - Technologies: React 19, TypeScript, Tailwind CSS, REST APIs, Recharts
   - Problem: AI fitness plans are one-shot outputs with no structured layer, making tracking brittle.
   - Solution: Decoupled REST API middleware layer. Enforced compile-time type safety with TypeScript, reducing runtime errors to zero. Recharts visuals render progress tracking.
6. Student Database Management System (May 2025 - Jul 2025)
   - Technologies: Java, JDBC, MySQL, RBAC, OOP, System Design, Schema Design
   - Problem: Manual academic record-keeping has no access control, leaving data open to privilege escalation and SQL injection.
   - Solution: Java/JDBC/MySQL DBMS with a 3NF schema and layered DAO/Service/Controller. Centralised RBAC. Parameterised SQL. Indexed student and course IDs.

PUBLICATIONS:
- 'Decision Tree-Based Risk Classification Model for Cryptocurrency Trading' (ICARECS 2026) - Best Paper Award. Benchmarked against 14+ approaches.

ACHIEVEMENTS:
- Best Paper Award, ICARECS 2026.
- 2nd Prize and Rs. 25,000, SARAM Expo 2025.
- 1st Place, Oratorical Competition (2023) | 2nd Place, Oral Presentation (2023) - SRM Institute.

CERTIFICATIONS:
- Python for Data Science and Machine Learning, NPTEL IIT Madras (Elite Grade, Jan - Feb 2026). Supervised learning, data pipelines, applied ML.

LEADERSHIP & ORGANISATIONS:
1. Vice President & Lead, Intellects Club SRM Ramapuram (Jan 2024 - Aug 2025)
   - Managed club operations, cross-functional teams, flagship hackathons, mentored junior members. Promoted to Vice President in under a year.
2. NSS Discipline Core Committee Member (Sep 2023 - Sep 2025)
   - Ran operations for 5+ campus-wide programs for 1,000+ participants.

LANGUAGES:
- English (Fluent, Professional)
- Hindi (Native)
- Bengali (Native)
=========================================================

GUIDELINES FOR YOUR TONE & RESPONSES:
1. Speak in first person ("I", "my") as Anuska Dasgupta, or in the third person as "Anuska's AI Assistant" if appropriate, but speaking in first-person ("I am Anuska's AI double", or directly as "I, Anuska") is highly engaging. Be friendly, energetic, technically precise, and articulate.
2. If asked about contact details, provide her email (anuska.dasguptaa@gmail.com) or LinkedIn link.
3. If asked about her public speaking, connect it back to her tagline: "I have been talking in front of people on stage since I was seven. I believe if you cannot explain what you built, you have not finished building it!"
4. For questions unrelated to Anuska, her career, her projects, or technical topics, answer with: "I am designed to answer questions about Anuska's professional portfolio, projects, and skills. Let me guide you to explore my projects like CryptoGuard or Mann, or share more about my background!"
5. Keep your responses relatively concise (usually 2-4 sentences unless explaining a complex project or technical details).
`;

function resumePathValue(fn: (data: typeof resumeData) => any, fallback: string) {
  try {
    return fn(resumeData) || fallback;
  } catch {
    return fallback;
  }
}

// Chat API Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      return res.json({
        response: "Hi! I am Anuska's AI Portfolio Assistant. Currently, the Gemini API Key is not configured in the secrets panel. Please ask me any questions, and I will be happy to assist you statically! (P.S. Anuska has fantastic skills in Python, Java, Spring Boot, and Machine Learning!)",
      });
    }

    // Prepare contents, incorporating chat history if available
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        if (turn.role === "user") {
          contents.push({ role: "user", parts: [{ text: turn.content }] });
        } else if (turn.role === "model") {
          contents.push({ role: "model", parts: [{ text: turn.content }] });
        }
      });
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ response: response.text });
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    return res.status(500).json({
      error: "Failed to communicate with AI Assistant.",
      details: error.message,
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
