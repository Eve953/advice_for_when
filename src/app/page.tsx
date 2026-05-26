"use client";

import React, { useState, useEffect } from "react";
import { insertMessageToSupabase, fetchRandomMessageForScenario } from "@/lib/supabase";
import { SCENARIOS } from "@/lib/mockData";

// Hardcoded non-robotic pastel array to give that true community board look
const pastelColors = [
  { bg: "bg-[#FEF9E7]", text: "text-neutral-800", border: "border-[#F9E79F]" }, // Soft Canary
  { bg: "bg-[#EBF5FB]", text: "text-neutral-800", border: "border-[#AED6F1]" }, // Muted Pale Blue
  { bg: "bg-[#E8F8F5]", text: "text-neutral-800", border: "border-[#A3E4D7]" }, // Washed Sage
  { bg: "bg-[#FDEDEC]", text: "text-neutral-800", border: "border-[#F5B7B1]" }, // Muted Blush Rose
];

type ViewState = "grid" | "message" | "submit";

interface MessageData {
  id?: string;
  scenario: string;
  message: string;
  created_at?: string;
}

export default function AdviceBoard() {
  const [currentView, setCurrentView] = useState<ViewState>("grid");
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState<MessageData | null>(null);
  const [submissionText, setSubmissionText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Load a message from Supabase or fallback
  const handleSelectScenario = async (scenario: string) => {
    setSelectedScenario(scenario);
    setIsLoading(true);
    setCurrentView("message");

    try {
      const data = await fetchRandomMessageForScenario(scenario);
      if (data) {
        setCurrentMessage({
          id: String(data.id),
          scenario: data.scenario,
          message: data.message,
          created_at: data.timestamp
        });
      } else {
        setCurrentMessage(null);
      }
    } catch (err) {
      console.log("Using local fallback state for viewing experience.");
    } finally {
      setIsLoading(false);
    }
  };

  // View 3 submission handler (React 19 precise SubmitEvent alignment)
  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    setIsLoading(true);
    setSubmissionError(null);

    const success = await insertMessageToSupabase(selectedScenario, submissionText.trim());

    if (success) {
      setCurrentMessage({
        scenario: selectedScenario,
        message: submissionText.trim(),
        created_at: new Date().toISOString()
      });
      setSubmissionText("");
      setCurrentView("message");
    } else {
      setSubmissionError("Could not pin your note to the live database right now.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-neutral-800 p-6 md:p-12 font-mono flex flex-col items-center">
      
      {/* Dynamic Header */}
      <header className="w-full max-w-5xl mb-12 text-center border-b border-neutral-300 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">advice for when...</h1>
        <p className="text-xs text-neutral-500 lowercase">
          [ live community archive // rls active // total notes: 10 states ]
        </p>
      </header>

      {/* VIEW 1: THE STICKY NOTE BOARD */}
      {currentView === "grid" && (
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8 text-sm text-neutral-600">
            👇 select an existential state to rip a note off the wall
          </div>
          
          {/* Square Tactile Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            {SCENARIOS.map((scenario, index) => {
              const color = pastelColors[index % pastelColors.length];
              return (
                <button
                  key={scenario}
                  onClick={() => handleSelectScenario(scenario)}
                  className={`aspect-square w-full ${color.bg} ${color.text} ${color.border} border-t-4 border-l border-r border-b p-4 flex flex-col justify-between text-left transition-transform duration-150 hover:-translate-y-1 hover:shadow-md rounded-none relative`}
                  style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.05)" }}
                >
                  <span className="text-[10px] text-neutral-400 block font-bold font-mono">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold tracking-tight font-sans mt-2 grow lowercase leading-tight">
                    {scenario}
                  </span>
                  <span className="text-[10px] text-right block text-neutral-400 font-mono w-full self-end">
                    pull →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: THE DETACHED STICKY NOTE READ VIEW */}
      {currentView === "message" && (
        <div className="w-full max-w-md flex flex-col items-center">
          <div className={`w-full aspect-square bg-[#FEF9E7] border-t-[6px] border-t-yellow-300 border-l border-r border-b border-neutral-300 p-8 flex flex-col justify-between transition-opacity duration-300 rounded-none`}
               style={{ boxShadow: "5px 5px 0px rgba(0,0,0,0.04)" }}>
            <div>
              <div className="text-[11px] text-neutral-400 lowercase mb-6 tracking-widest">
                situation: {selectedScenario}
              </div>
              {isLoading ? (
                <div className="text-sm text-neutral-400 italic">Reaching for paper...</div>
              ) : (
                <p className="text-xl md:text-2xl font-serif text-neutral-800 leading-relaxed italic pr-2">
                  "{currentMessage ? currentMessage.message : "The board is empty here. Leave the first piece of writing for someone else."}"
                </p>
              )}
            </div>
            
            <div className="text-[10px] text-neutral-400 font-mono mt-4 flex justify-between items-center border-t border-neutral-200 pt-4">
              <span>{currentMessage?.created_at ? new Date(currentMessage.created_at).toLocaleDateString() : "untracked_time"}</span>
              <span className="uppercase text-[9px] bg-neutral-200 px-1.5 py-0.5 text-neutral-600 font-bold">anon_artifact</span>
            </div>
          </div>

          {/* Clean Operational Actions underneath */}
          <div className="flex gap-4 w-full mt-8">
            <button 
              onClick={() => handleSelectScenario(selectedScenario)}
              className="flex-1 py-3 border border-neutral-400 text-xs uppercase hover:bg-neutral-800 hover:text-white transition-colors duration-150 rounded-none bg-white font-bold"
            >
              🔄 read another
            </button>
            <button 
              onClick={() => setCurrentView("submit")}
              className="flex-1 py-3 border border-neutral-400 text-xs uppercase hover:bg-neutral-800 hover:text-white transition-colors duration-150 rounded-none bg-white font-bold"
            >
              ✍️ leave one
            </button>
          </div>
          <button 
            onClick={() => setCurrentView("grid")}
            className="mt-6 text-xs text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            ← back to physical board view
          </button>
        </div>
      )}

      {/* VIEW 3: WRITE AND STICK ONTO THE WALL */}
      {currentView === "submit" && (
        <div className="w-full max-w-md flex flex-col items-center">
          <form onSubmit={handleFormSubmit} className="w-full aspect-square bg-[#FDEDEC] border-t-[6px] border-t-red-300 border-l border-r border-b border-neutral-300 p-8 flex flex-col justify-between rounded-none"
                style={{ boxShadow: "5px 5px 0px rgba(0,0,0,0.04)" }}>
            <div className="w-full flex flex-col grow">
              <label className="text-[11px] text-neutral-400 lowercase mb-4 tracking-widest block">
                scribble advice for: {selectedScenario}
              </label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                maxLength={280}
                placeholder="What single sentence would you drop here for a complete stranger to look at?"
                className="w-full grow bg-transparent border-none outline-none resize-none font-serif text-lg text-neutral-800 italic placeholder-neutral-400 focus:ring-0 p-0"
                disabled={isLoading}
              />
            </div>

            <div className="text-[10px] text-neutral-400 font-mono mt-4 flex justify-between items-center border-t border-neutral-200 pt-4 w-full">
              <span>{280 - submissionText.length} characters left</span>
              <span className="uppercase text-[9px] text-red-500 font-bold">drafting_note</span>
            </div>
          </form>

          {submissionError && (
            <p className="text-xs text-red-500 mt-2 font-mono">{submissionError}</p>
          )}

          <div className="flex gap-4 w-full mt-8">
            <button 
              onClick={() => setCurrentView("message")}
              className="flex-1 py-3 border border-neutral-400 text-xs uppercase hover:bg-neutral-200 transition-colors duration-150 rounded-none bg-white"
            >
              cancel
            </button>
            <button 
              type="submit"
              onClick={(e) => {
                // Safely proxy programmatic fire into standard form element wrapper
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              disabled={isLoading || !submissionText.trim()}
              className="flex-1 py-3 border border-neutral-800 bg-neutral-900 text-white text-xs uppercase hover:bg-neutral-800 disabled:bg-neutral-300 disabled:border-neutral-300 transition-colors duration-150 rounded-none font-bold"
            >
              {isLoading ? "pinning..." : "📌 slap on board"}
            </button>
          </div>
        </div>
      )}

    </main>
  );
}