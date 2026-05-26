"use client";

import React, { useState, useEffect } from "react";
import { SCENARIOS, AdviceMessage } from "@/lib/mockData";
import { fetchRandomMessageForScenario, insertMessageToSupabase } from "@/lib/supabase";

type ViewState = "grid" | "message" | "submit";

export default function AdviceApp() {
  const [currentView, setCurrentView] = useState<ViewState>("grid");
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [activeMessage, setActiveMessage] = useState<AdviceMessage | null>(null);
  
  // SPA Form & Submission State
  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Loading & Database fetching State
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom transition animation state
  const [viewAnimationClass, setViewAnimationClass] = useState("view-fade");
  
  // Live local administrative timestamp
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Keep local clock updated for the broadsheet administrative bar
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }) +
          " // " +
          now.toLocaleTimeString("en-US", { hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to handle screen-to-screen routing shifts with an opacity fade
  const navigateToView = (nextView: ViewState) => {
    setViewAnimationClass("");
    // Small delay to reset the animation class, allowing the browser to trigger a fresh mount fade-in
    setTimeout(() => {
      setCurrentView(nextView);
      setViewAnimationClass("view-fade");
    }, 50);
  };

  // View 2 fetch subagent
  const loadMessageForScenario = async (scenario: string) => {
    setIsLoading(true);
    navigateToView("message");
    
    try {
      const message = await fetchRandomMessageForScenario(scenario);
      setActiveMessage(message);
    } catch (err) {
      console.error("Failed to load message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch action handler
  const handleAnotherMessage = () => {
    if (selectedScenario) {
      loadMessageForScenario(selectedScenario);
    }
  };

  // View 3 submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    const result = await insertMessageToSupabase(selectedScenario, submissionText.trim());

    if (result.success) {
      // Transition smoothly back to View 2 and reload the messages
      const tempText = submissionText.trim();
      setSubmissionText("");
      setIsSubmitting(false);
      
      // Let's set the newly submitted message as the active message immediately for an instant response loop
      setActiveMessage({
        id: result.data?.[0]?.id || "newly-added",
        scenario: selectedScenario,
        message: tempText,
        timestamp: new Date().toISOString(),
      });
      navigateToView("message");
    } else {
      setIsSubmitting(false);
      // Display the error on the form, but let them proceed or bypass
      setSubmissionError(result.error || "An unknown error occurred while submitting.");
    }
  };

  return (
    <main className="min-h-screen newspaper-dots p-4 md:p-8 flex flex-col items-center justify-start selection:bg-black selection:text-white">
      {/* Structural Magazine Wrapper */}
      <div className="w-full max-w-5xl border border-black flex flex-col bg-[#FBFBFA] shadow-none">
        
        {/* Broadsheet Masthead Header */}
        <header className="border-b border-black flex flex-col">
          <div className="flex flex-col md:flex-row border-b border-black">
            {/* Main branding cell */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
                [ THE ARCHIVAL WISDOM REPOSITORY ]
              </span>
              <h1 
                onClick={() => navigateToView("grid")} 
                className="font-serif text-3xl md:text-5xl font-black uppercase tracking-tight cursor-pointer hover:opacity-85 select-none"
              >
                Advice for When
              </h1>
            </div>
            
            {/* Quick system statistics */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between font-mono text-xs">
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-neutral-500">FORMAT:</span>
                <span className="font-bold">SINGLE PAGE BROAD-GRID</span>
              </div>
              <div className="flex justify-between border-b border-black/10 py-2">
                <span className="text-neutral-500">RLS STATE:</span>
                <span className="font-bold text-green-700">PUBLIC ANON</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">INDEXED:</span>
                <span className="font-bold">10 LIFE CATEGORIES</span>
              </div>
            </div>
          </div>

          {/* Running Sub-Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-2.5 bg-black text-[#FBFBFA] font-mono text-[10px] tracking-wider uppercase">
            <div>
              <span>CATALOG // VOL. XXVI</span>
              <span className="mx-3 opacity-40">|</span>
              <span>LIVE RECORD MODE</span>
            </div>
            <div className="mt-1 sm:mt-0 font-bold">
              {currentTime || "LOADING CLOCK // ONLINE"}
            </div>
          </div>
        </header>

        {/* 3-View Editorial Content Stage */}
        <div className={`flex-1 flex flex-col min-h-[450px] ${viewAnimationClass}`}>
          
          {/* =======================================================
              VIEW 1: SCENARIO GRID
             ======================================================= */}
          {currentView === "grid" && (
            <div className="flex-1 flex flex-col">
              {/* Context bar */}
              <div className="border-b border-black px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-xs bg-black/[0.02]">
                <span className="font-bold uppercase tracking-wider text-black">
                  [ STEP I: SELECT AN ACTIVE EXISTENTIAL SCENARIO ]
                </span>
                <span className="text-neutral-500 mt-1 sm:mt-0">
                  CLICK ON A TAB TO ARCHIVE INDIVIDUAL WISDOM
                </span>
              </div>

              {/* Broadsheet Newspaper Scenario Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 border-collapse">
                {SCENARIOS.map((scenario, index) => (
                  <button
                    key={scenario}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      loadMessageForScenario(scenario);
                    }}
                    className="group relative flex flex-col justify-between items-start text-left p-6 md:p-8 min-h-[140px] border-b border-black md:odd:border-r border-black bg-transparent hover:bg-black hover:text-[#FBFBFA] transition-colors duration-200 cursor-pointer"
                  >
                    {/* Index Identifier */}
                    <div className="w-full flex justify-between items-center font-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                      <span>SEC. 0{index + 1}</span>
                      <span className="text-[10px] font-bold uppercase">ARCHIVE_LINK // ➔</span>
                    </div>

                    {/* Scenario Label (Serif Core) */}
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold capitalize my-4 leading-tight group-hover:translate-x-1 transition-transform duration-200">
                      When you are {scenario}
                    </h3>

                    {/* Secondary Monospace Tag */}
                    <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 group-hover:text-[#FBFBFA]/60 transition-colors">
                      CL. {scenario.replace(/\s+/g, "_")} // SYSTEM_ANON_ACCESS
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================
              VIEW 2: MESSAGE DISPLAY
             ======================================================= */}
          {currentView === "message" && (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Back to Grid Header */}
              <div className="border-b border-black flex items-center justify-between font-mono text-xs bg-black/[0.02]">
                <button
                  onClick={() => navigateToView("grid")}
                  className="px-6 py-4 font-bold border-r border-black hover:bg-black hover:text-[#FBFBFA] transition-colors cursor-pointer"
                >
                  ← BACK TO GRID
                </button>
                
                <div className="px-6 py-4 flex items-center space-x-2 text-neutral-500">
                  <span>ACTIVE SCENARIO:</span>
                  <span className="font-bold text-black uppercase underline decoration-1">
                    {selectedScenario}
                  </span>
                </div>
              </div>

              {/* Core Message Display (Serif typography) */}
              <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:py-20 border-b border-black">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-6 h-6 border border-black border-t-transparent animate-spin rounded-none"></div>
                    <span className="font-mono text-xs uppercase tracking-widest animate-pulse">
                      RETRIEVING FROM ANONYMOUS LEDGER...
                    </span>
                  </div>
                ) : activeMessage ? (
                  <div className="max-w-3xl w-full flex flex-col space-y-8">
                    {/* Giant open quotes */}
                    <span className="font-serif text-6xl text-neutral-300 leading-none select-none -mb-6 text-left">
                      “
                    </span>
                    
                    {/* The Message */}
                    <p className="font-serif text-2xl md:text-4xl leading-relaxed text-black font-medium italic text-center px-4">
                      {activeMessage.message}
                    </p>

                    {/* Giant close quotes */}
                    <span className="font-serif text-6xl text-neutral-300 leading-none select-none -mt-6 text-right">
                      ”
                    </span>
                  </div>
                ) : (
                  <div className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                    NO ADVICE RECORDED YET FOR THIS SCENARIO
                  </div>
                )}
              </div>

              {/* Monospace Metadata Panel & Action Blocks */}
              <div className="flex flex-col md:flex-row border-t border-black bg-black/[0.01]">
                
                {/* Monospace Metadata */}
                <div className="flex-1 p-6 font-mono text-[10px] space-y-2 border-b md:border-b-0 md:border-r border-black flex flex-col justify-center">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">RECORD ID:</span>
                    <span className="font-bold tracking-tight text-neutral-800">{activeMessage?.id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">ARCHIVE TIMESTAMP:</span>
                    <span className="font-bold tracking-tight text-neutral-800">
                      {activeMessage?.timestamp
                        ? new Date(activeMessage.timestamp).toLocaleString("en-US")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">SOURCE DRIVER:</span>
                    <span className="font-bold text-neutral-800">
                      {activeMessage?.id.toString().startsWith("m-")
                        ? "LOCAL STATIC SEED BUFFER"
                        : "LIVE POSTGRESQL RLS"}
                    </span>
                  </div>
                </div>

                {/* Flat Action Blocks */}
                <div className="w-full md:w-96 grid grid-cols-2 border-collapse font-mono text-xs">
                  <button
                    onClick={handleAnotherMessage}
                    disabled={isLoading}
                    className="p-6 text-center font-bold border-r border-black hover:bg-black hover:text-[#FBFBFA] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center"
                  >
                    ANOTHER MESSAGE
                  </button>
                  <button
                    onClick={() => {
                      setSubmissionText("");
                      setSubmissionError(null);
                      navigateToView("submit");
                    }}
                    className="p-6 text-center font-bold bg-black text-[#FBFBFA] hover:bg-neutral-850 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                  >
                    LEAVE ONE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              VIEW 3: SUBMISSION FORM
             ======================================================= */}
          {currentView === "submit" && (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Back to message view */}
              <div className="border-b border-black flex items-center justify-between font-mono text-xs bg-black/[0.02]">
                <button
                  onClick={() => navigateToView("message")}
                  className="px-6 py-4 font-bold border-r border-black hover:bg-black hover:text-[#FBFBFA] transition-colors cursor-pointer"
                >
                  ← CANCEL SUBMISSION
                </button>
                <div className="px-6 py-4 flex items-center space-x-2 text-neutral-500">
                  <span>TARGETING:</span>
                  <span className="font-bold text-black uppercase">
                    WHEN {selectedScenario}
                  </span>
                </div>
              </div>

              {/* Form viewport */}
              <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                <div className="flex-1 p-6 md:p-10 flex flex-col space-y-6">
                  {/* Monospace header */}
                  <div className="space-y-2">
                    <h2 className="font-mono text-sm md:text-base font-bold uppercase tracking-wider text-black">
                      What would you leave for someone in this situation?
                    </h2>
                    <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                      Your entry will be committed directly to the public anonymous ledger. Make it count.
                    </p>
                  </div>

                  {/* Submission Error Alert */}
                  {submissionError && (
                    <div className="border border-red-500 bg-red-50 text-red-700 p-4 font-mono text-xs rounded-none">
                      <span className="font-bold">DATABASE COMMITTAL FAILURE:</span> {submissionError}
                      <p className="mt-1 text-[10px] text-red-500">
                        (Note: The local app state will still update to preview your submission, but it did not save to Supabase. Ensure database is online or table rules are open.)
                      </p>
                    </div>
                  )}

                  {/* Wide Text Entry Viewport */}
                  <div className="flex-1 min-h-[180px] border border-black relative bg-white">
                    <textarea
                      required
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Write your words here. Be gentle, be concise, be real."
                      maxLength={400}
                      disabled={isSubmitting}
                      className="w-full h-full p-4 md:p-6 font-serif text-lg md:text-xl italic bg-transparent focus:outline-none resize-none placeholder:text-neutral-300 placeholder:italic text-black"
                    />
                    
                    {/* Character limit badge */}
                    <div className="absolute bottom-3 right-3 font-mono text-[9px] text-neutral-400 bg-[#FBFBFA] px-2 py-0.5 border border-neutral-200">
                      {submissionText.length} / 400 CHARS
                    </div>
                  </div>
                </div>

                {/* Submit Action Bar */}
                <div className="border-t border-black grid grid-cols-1 md:grid-cols-2 border-collapse font-mono text-xs">
                  {/* Instructions block */}
                  <div className="p-6 border-b md:border-b-0 md:border-r border-black font-mono text-[10px] text-neutral-500 flex items-center">
                    <span>
                      COMMIT TIME: {new Date().toISOString()} <br />
                      ANON AUTHORIZATION STATUS: GRANTED_OK
                    </span>
                  </div>

                  {/* Sharp rectangular submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !submissionText.trim()}
                    className="p-6 text-center font-bold bg-black text-[#FBFBFA] hover:bg-neutral-800 hover:text-white transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer uppercase flex items-center justify-center text-sm tracking-wider"
                  >
                    {isSubmitting ? "COMMITTING RECORD..." : "COMMIT TO PUBLIC LEDGER"}
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

        {/* Broadsheet Footnote */}
        <footer className="border-t border-black p-6 flex flex-col md:flex-row justify-between items-center bg-black/[0.01] font-mono text-[10px] text-neutral-500">
          <div className="mb-2 md:mb-0">
            © 2026 ADVICE FOR WHEN. CODENAME: BROAD-GRID. RLS ARCHIVE ACTIVE.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-black cursor-help" title="No gradients, no glassmorphism, no drop shadows, purely 1px black-on-beige borders.">DESIGN SYSTEM V1.0</span>
            <span>|</span>
            <span className="hover:text-black cursor-help" title="Next.js App Router, Supabase JS Client, Tailwind CSS v4.">STACK METRIC</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
