/**
 * @file DevConsole.tsx
 * @description Hidden Developer Customization Console (Slide-over Drawer).
 * Accessible securely by appending `#dev`, `?dev=true` or visiting `/dev-console`.
 * Provides direct base64-encoded PDF resume uploads and comprehensive local build/deploy documentation.
 */

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  BookOpen,
  Upload,
  CheckCircle2,
  ImageIcon,
  Tag,
  GitBranch,
  Terminal,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DevConsole({ isOpen, onClose }: DevConsoleProps) {
  const [customResumeExists, setCustomResumeExists] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"resume" | "photo" | "tags" | "github" | "commands">("resume");

  // Check custom resume status on component mount
  useEffect(() => {
    fetch("/api/resume/status")
      .then(res => res.json())
      .then(data => setCustomResumeExists(data.exists))
      .catch(err => console.error("Error checking resume status:", err));
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadStatus("Error: Only PDF files are allowed.");
      setTimeout(() => setUploadStatus(null), 4000);
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch("/api/resume/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Data })
        });

        const data = await res.json();
        if (data.success) {
          setCustomResumeExists(true);
          setUploadStatus("Resume uploaded successfully!");
        } else {
          setUploadStatus(`Error: ${data.error || "Upload failed"}`);
        }
        setTimeout(() => setUploadStatus(null), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadStatus("Error: Failed to upload file.");
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Slide-over Content Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl md:max-w-2xl bg-white border-l border-brand-border shadow-2xl z-50 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-brand-border bg-neutral-50 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 text-emerald-600 font-mono text-[10px] font-bold tracking-widest uppercase mb-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Developer Workspace</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900 animate-fade-in">
                  Anuska's Developer Console
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-light">
                  Manage your portfolio assets, read custom documentation, or upload your resume PDF directly.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Console Tabs */}
            <div className="flex border-b border-brand-border px-6 md:px-8 bg-neutral-50 shrink-0">
              <button
                onClick={() => setActiveTab("resume")}
                className={`py-3 text-[10px] font-bold tracking-widest uppercase border-b-2 mr-6 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "resume"
                    ? "border-neutral-900 text-neutral-950 font-extrabold"
                    : "border-transparent text-neutral-400 hover:text-neutral-950"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume PDF Asset</span>
              </button>
              <button
                onClick={() => setActiveTab("photo")}
                className={`py-3 text-[10px] font-bold tracking-widest uppercase border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab !== "resume"
                    ? "border-neutral-900 text-neutral-950 font-extrabold"
                    : "border-transparent text-neutral-400 hover:text-neutral-950"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Interactive Dev Guide</span>
              </button>
            </div>

            {/* Scrollable Content Pane */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {activeTab === "resume" ? (
                /* RESUME TAB */
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60 flex items-start space-x-3.5 animate-fade-in">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-1">Resume Asset Strategy</h4>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed">
                        The <span className="font-semibold">Get Resume</span> button on your main page downloads your final, professional PDF. This console allows you to upload that PDF directly, or you can commit a file named <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-[11px] font-mono font-semibold">Anuska_Dasgupta_Resume.pdf</code> to the root of your GitHub repository.
                      </p>
                    </div>
                  </div>

                  <div className="border border-brand-border rounded-2xl p-6 bg-white space-y-5 shadow-sm">
                    <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">PDF File Upload Panel</h4>
                    
                    <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl p-8 text-center transition-colors relative">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 rounded-full bg-neutral-50 text-neutral-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-neutral-800">Click or drag your latest PDF resume here</span>
                        <span className="text-[10px] text-neutral-400 font-mono">Only PDF files are accepted</span>
                      </div>
                    </div>

                    {/* Statuses */}
                    {uploadStatus && (
                      <div className={`p-3.5 rounded-xl text-xs font-mono font-medium flex items-center space-x-2 animate-fade-in ${
                        uploadStatus.startsWith("Error") 
                          ? "bg-red-50 text-red-700 border border-red-100" 
                          : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      }`}>
                        <span>{uploadStatus}</span>
                      </div>
                    )}

                    {customResumeExists ? (
                      <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/50 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-bold font-mono">Custom PDF Resume loaded successfully!</span>
                        </div>
                        <a
                          href="/api/resume/download"
                          download="Anuska_Dasgupta_Resume.pdf"
                          className="text-[10px] font-bold tracking-widest uppercase bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Verify Download
                        </a>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col space-y-2 text-neutral-600">
                        <span className="text-xs font-bold font-mono text-neutral-800">No custom PDF resume uploaded yet.</span>
                        <span className="text-[11px] leading-relaxed font-light">
                          Currently, clicking "Get Resume" on the website will download a dynamically compiled PDF file. Upload your custom PDF above or commit it in your repository root to activate direct download!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* INTERACTIVE GUIDE TAB */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full items-start animate-fade-in">
                  {/* Inner Left Nav */}
                  <div className="md:col-span-1 flex flex-col space-y-1.5 shrink-0">
                    {[
                      { id: "photo", label: "🖼️ Photos" },
                      { id: "tags", label: "🏷️ Event Tags" },
                      { id: "github", label: "🚀 CI/CD" },
                      { id: "commands", label: "🛠️ Commands" }
                    ].map(subTab => (
                      <button
                        key={subTab.id}
                        onClick={() => setActiveTab(subTab.id as any)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                          activeTab === subTab.id
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                        }`}
                      >
                        {subTab.label}
                      </button>
                    ))}
                  </div>

                  {/* Inner Content Pane */}
                  <div className="md:col-span-3 space-y-6">
                    {activeTab === "photo" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider border-b border-brand-border pb-2 flex items-center space-x-1.5">
                          <ImageIcon className="w-4 h-4 text-neutral-400" />
                          <span>Adding or Swapping Photos</span>
                        </h4>
                        
                        <div className="space-y-4 text-xs text-neutral-600 font-light leading-relaxed">
                          <p>
                            Static assets in your portfolio are served from the standard <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded font-semibold text-neutral-800">/public</code> directory.
                          </p>
                          
                          <div className="border border-brand-border rounded-xl p-4 space-y-3 bg-neutral-50/50">
                            <span className="font-semibold text-neutral-800 block text-xs uppercase tracking-wider">A. Profile Photo</span>
                            <ol className="list-decimal pl-4 space-y-1.5 font-light">
                              <li>Save your profile photo as <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">profile-photo.jpg</code>.</li>
                              <li>Place it inside the <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">public/images/</code> folder in your repo.</li>
                              <li>If missing, the app will automatically display the matrix digital SVG fallback avatar.</li>
                            </ol>
                          </div>

                          <div className="border border-brand-border rounded-xl p-4 space-y-3 bg-neutral-50/50">
                            <span className="font-semibold text-neutral-800 block text-xs uppercase tracking-wider">B. Gallery Milestones</span>
                            <p>Place any speaking, presentation, or award images inside <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">public/images/</code> with matching filenames defined inside <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">src/App.tsx</code>'s galleryItems array.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "tags" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider border-b border-brand-border pb-2 flex items-center space-x-1.5">
                          <Tag className="w-4 h-4 text-neutral-400" />
                          <span>Milestones & Event Tagging</span>
                        </h4>
                        
                        <div className="space-y-4 text-xs text-neutral-600 font-light leading-relaxed">
                          <p>
                            Milestones in the Gallery tab are declared as standard JSON objects inside the <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">galleryItems</code> array around line 276 in <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">src/App.tsx</code>.
                          </p>
                          
                          <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                            <table className="w-full text-left font-mono text-[10px] bg-white">
                              <thead className="bg-neutral-50 text-neutral-400 border-b border-brand-border uppercase tracking-widest font-bold">
                                <tr>
                                  <th className="p-3">Tag Attribute</th>
                                  <th className="p-3">Event/Milestone Type</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                                <tr>
                                  <td className="p-3 font-semibold text-emerald-600">"Speaking"</td>
                                  <td className="p-3 text-neutral-500 font-sans">Invited speaker, oratorical keynotes, panel moderator.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-semibold text-emerald-600">"Competition"</td>
                                  <td className="p-3 text-neutral-500 font-sans">Exhibition showcases, Project Day awards, tech expo prizes.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-semibold text-emerald-600">"Research"</td>
                                  <td className="p-3 text-neutral-500 font-sans">Research paper presentations, academic symposia.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-semibold text-emerald-600">"Hackathon"</td>
                                  <td className="p-3 text-neutral-500 font-sans">Sprint programming, collaborative hackathons.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-semibold text-emerald-600">"Leadership"</td>
                                  <td className="p-3 text-neutral-500 font-sans">NSS Discipline committee, student clubs officer.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 font-mono text-[10px] space-y-2 overflow-x-auto">
                            <span className="font-bold text-neutral-800 text-[11px] block font-sans">Item Object Template:</span>
                            <pre className="text-neutral-600 leading-normal">{`{
  id: "oratorical_competition_2026",
  title: "1st Place – SRMIST Oratorical Contest",
  description: "Keynote presentation on ML philosophy.",
  image: "/images/oratorical-keynote.jpg",
  tag: "Speaking",
  date: "Sep 2023",
  fallback: "https://images.unsplash.com/photo-..."
}`}</pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "github" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider border-b border-brand-border pb-2 flex items-center space-x-1.5">
                          <GitBranch className="w-4 h-4 text-neutral-400" />
                          <span>GitHub Actions CI/CD Pipeline</span>
                        </h4>
                        
                        <div className="space-y-4 text-xs text-neutral-600 font-light leading-relaxed">
                          <p>
                            A GitHub Action workflow is pre-configured at <code className="font-mono bg-neutral-100 px-1 font-semibold text-neutral-800">.github/workflows/deploy.yml</code> to verify your builds.
                          </p>
                          
                          <div className="border border-brand-border rounded-xl p-4 bg-neutral-50/50 space-y-3">
                            <span className="font-bold text-neutral-800 block text-xs uppercase tracking-wider">Automated Verification</span>
                            <p>On every <code className="font-mono bg-neutral-100 px-1 text-neutral-800 font-semibold">push</code> or <code className="font-mono bg-neutral-100 px-1 text-neutral-800 font-semibold">pull_request</code> to the main branch, GitHub Actions will automatically:</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Provision a fresh Ubuntu runner environment.</li>
                              <li>Install and cache your Node.js dependencies.</li>
                              <li>Run TypeScript checking and syntax verification via ESLint.</li>
                              <li>Compile both frontend static files and Express server bundles.</li>
                            </ul>
                          </div>

                          <div className="border border-brand-border rounded-xl p-4 bg-neutral-50/50 space-y-2">
                            <span className="font-bold text-neutral-800 block text-xs uppercase tracking-wider">Unlocking Automatic Cloud Deployment</span>
                            <p className="leading-relaxed">To automatically compile your container and deploy it to Google Cloud Run, simply uncomment the final job block in <code className="font-mono bg-neutral-100 px-1 text-neutral-800">deploy.yml</code> and add your Google Cloud credentials to your GitHub Repository Secrets!</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "commands" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider border-b border-brand-border pb-2 flex items-center space-x-1.5">
                          <Terminal className="w-4 h-4 text-neutral-400" />
                          <span>Local Build & Test Commands</span>
                        </h4>
                        
                        <div className="space-y-4 text-xs text-neutral-600 font-light">
                          <p className="leading-relaxed">Use these standard commands inside your local workspace terminal root folder:</p>
                          
                          <div className="space-y-3 font-mono text-[11px]">
                            <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block font-sans mb-1">1. Install dependencies</span>
                                <code className="text-neutral-800 font-semibold font-mono">npm install</code>
                              </div>
                            </div>

                            <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block font-sans mb-1">2. Run Local Development Server</span>
                                <code className="text-neutral-800 font-semibold font-mono">npm run dev</code>
                              </div>
                            </div>

                            <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block font-sans mb-1">3. Check Types & Lints</span>
                                <code className="text-neutral-800 font-semibold font-mono">npm run lint</code>
                              </div>
                            </div>

                            <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block font-sans mb-1">4. Compile Production Bundles</span>
                                <code className="text-neutral-800 font-semibold font-mono">npm run build</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Console Footer */}
            <div className="p-6 md:p-8 border-t border-brand-border bg-neutral-50 shrink-0 text-center">
              <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                Anuska Dasgupta • Personal Portfolio Console • Version 1.1.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
