# 👩‍💻 Anuska's Portfolio: Developer Customization Guide

Welcome to your professional Software & Machine Learning Portfolio! This guide is designed to make it incredibly easy for you to maintain, update, and deploy your portfolio website.

---

## 📌 Table of Contents
1. [📂 Project Architecture](#-project-architecture)
2. [🖼️ Adding or Swapping Photos](#️-adding-or-swapping-photos)
3. [🏷️ Customizing Gallery Items & Event Tags](#️-customizing-gallery-items--event-tags)
4. [📄 Managing Your Resume PDF](#-managing-your-resume-pdf)
5. [📈 Filtering Projects & Managing Categories](#-filtering-projects--managing-categories)
6. [🛠️ Local Development & Build Commands](#️-local-development--build-commands)
7. [🚀 Deploying via GitHub Actions](#-deploying-via-github-actions)

---

## 📂 Project Architecture

Your portfolio runs on a modern, high-performance full-stack structure:
- **Frontend**: **React 18+** with **Vite** for lightning-fast compilation.
- **Styling**: **Tailwind CSS** (v4 `@import "tailwindcss";` in `/src/index.css`) for utility-first styling.
- **Animations**: **Framer Motion** (`motion/react`) for smooth page transitions and micro-interactions.
- **Backend API**: An **Express** server (`/server.ts`) which serves your app, manages resume uploads/downloads, and proxies the Gemini API key to keep it 100% hidden from client browsers.
- **Data Store**: Structured text and lists are kept separate from UI code in `/src/data/resume.ts`.

---

## 🖼️ Adding or Swapping Photos

Vite uses a standard `/public` directory to serve static assets at the root path. When you build your project (`npm run build`), Vite copies everything from `/public` directly into the `/dist` directory.

### A. How to Add Your Profile Photo
1. **Create the public folder** (if it doesn't already exist in your local Git repository):
   ```bash
   mkdir -p public/images
   ```
2. **Add your image**: Save your desired headshot as **`profile-photo.jpg`** (or `.png`) and place it inside the `public/images/` directory:
   ```
   /public/images/profile-photo.jpg
   ```
3. **Reference in code**: The app will automatically attempt to load `/images/profile-photo.jpg`. If it is not found, the website renders a beautiful, interactive SVG wireframe ML matrix avatar instead.

### B. How to Add Gallery Images
To add real photographs of you speaking, receiving awards, or working with your team:
1. Save your photographs as high-quality JPEGs or PNGs and copy them to `/public/images/`.
2. Give them clear filenames, such as:
   - `public/images/award-speech-competition.jpg`
   - `public/images/award-saram-expo.jpg`
   - `public/images/award-oral-presentation.jpg`
3. If a local file is missing, the web page will seamlessly pull a beautiful, high-resolution Unsplash fallback image of a similar theme (defined under the `.fallback` attribute in `galleryItems`).

---

## 🏷️ Customizing Gallery Items & Event Tags

All milestones (speaking keynotes, hackathons, college competitions) are declared inside `src/App.tsx` within the `galleryItems` array.

### How to Add a New Gallery Item or Edit Existing Ones:
1. Open `/src/App.tsx` and find `const galleryItems = [...]` (around line 276).
2. Each milestone is defined as a TypeScript object:
   ```typescript
   {
     id: "my_new_milestone",
     title: "1st Place – SRMIST Hackathon",
     description: "Brief, high-impact description of what you did and the outcomes.",
     image: "/images/srmist-hackathon-2026.jpg", // Path to your file in /public/images/
     tag: "Hackathon",                           // See accepted tags below
     date: "Mar 2026",
     fallback: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
   }
   ```

### 🏷️ Using Event Tags:
To maintain clean styling and automatic filtering, use one of these standard tags inside the `tag` attribute:
- `"Speaking"`: For keynotes, guest lecture invitations, and panels (e.g., Oratorical contests, Texus fest, PromptKraft speaker).
- `"Competition"`: For exhibition showcases, Project Day awards, and general competitions.
- `"Research"`: For oral research papers, journal publications, and conference presentations.
- `"Hackathon"`: For developer sprints and team coding events.
- `"Leadership"`: For student lead, NSS core committee, or club coordination activities.
- `"Volunteering"`: For social work, NGO events, and community drives.

---

## 📄 Managing Your Resume PDF

Your portfolio website separates public user actions from developer actions:
1. **For Visitors ("Get Resume")**: When visitors click the "Get Resume" button on your main page, they will instantly download your professional PDF resume directly.
2. **For You as the Developer ("Upload PDF")**: There is a secure **Developer Panel** on the website that lets you upload a custom PDF resume. This uploaded file is written directly to your project repository as `Anuska_Dasgupta_Resume.pdf` and is served as the official copy.

### 📁 How to Commit Your Resume Directly in Your Repo:
Instead of uploading through the UI, you can simply commit your final resume directly to the root of your local repository:
1. Name your PDF file exactly: **`Anuska_Dasgupta_Resume.pdf`**
2. Move it to the root of your project folder.
3. Commit and push it:
   ```bash
   git add Anuska_Dasgupta_Resume.pdf
   git commit -m "docs: add latest professional resume PDF"
   git push origin main
   ```
The website will automatically recognize this file and serve it immediately to any users clicking "Get Resume"!

---

## 📈 Filtering Projects & Managing Categories

Projects are automatically categorized into one of three filters in the **Projects tab** depending on their listed technologies:
1. **AI/ML**: Contains keywords like `"Decision Trees"`, `"Random Forest"`, `"XGBoost"`, `"Gemini API"`, `"NLP"`, `"scikit-learn"`, `"AI"`, `"Prompting"`, or `"SHAP"`.
2. **Backend/Full-stack**: Contains keywords like `"React"`, `"TypeScript"`, `"Node.js"`, `"Express.js"`, `"REST APIs"`, `"Java"`, `"Flask"`, `"Spring"`, `"Spring Boot"`, or `"JDBC"`.
3. **Databases/SQL**: Contains keywords like `"PostgreSQL"`, `"MySQL"`, `"JDBC"`, `"Schema Design"`, `"Database"`, or `"SQL"`.

To add a project or move it to a specific category, open `/src/data/resume.ts`, locate the `projects` array, and adjust the `technologies` array to include one of the keywords above.

---

## 🛠️ Local Development & Build Commands

Run these commands in your project's root folder during local development:

### Install Dependencies:
```bash
npm install
```

### Start Local Development Server:
```bash
npm run dev
```
Launches the dev environment at `http://localhost:3000`. This executes the Express server directly and hot-mounts Vite to hot-reload frontend changes.

### Production Compilation:
```bash
npm run build
```
Creates a hyper-optimized bundle:
- HTML/CSS/JS frontend compiled into `/dist/`.
- Express backend compiled into a single CommonJS file `/dist/server.cjs` via `esbuild`.

### Run Production Build:
```bash
npm run start
```
Spins up the bundled production server at port `3000`.

---

## 🚀 Deploying via GitHub Actions

A production-ready CI/CD configuration has been created for you inside **`.github/workflows/deploy.yml`**.

### How it works:
1. Every time you `git push` to your `main` or `master` branch, GitHub Actions will spin up a clean virtual machine.
2. It installs your project dependencies and runs `npm run lint` to verify your TypeScript types and check for syntax errors.
3. It builds your static frontend and Express server using `npm run build` to verify there are no compilation problems.
4. (Optional) You can uncomment the final block of the workflow to automatically build a Docker container and deploy it directly to **Google Cloud Run** or any other container-hosting service on every push.

---
*Developed with pristine visual balance, robust full-stack boundaries, and professional structure.*
