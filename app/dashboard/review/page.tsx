"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<
    { text: string; options: string[]; correctIndex: number; difficulty: string }[]
  >([
    { text: "What is React?", options: ["Library", "Framework", "Language", "Tool"], correctIndex: 0, difficulty: "Medium" },
    { text: "What is Next.js?", options: ["Backend", "Frontend", "Fullstack", "Library"], correctIndex: 2, difficulty: "Medium" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleConfirmTest = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      // Always go to create test page, even if API fails
      router.push(`/dashboard/create-test?questions=${encodeURIComponent(JSON.stringify(questions))}`);
    } catch (error) {
      console.error("API Error:", error);
      router.push(`/dashboard/create-test?questions=${encodeURIComponent(JSON.stringify(questions))}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-black">📋 Review Questions</h1>

        <ul className="space-y-4">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <li key={index} className="border p-4 rounded-lg shadow-md">
                <p className="font-semibold text-black">{q.text}</p>
                <p className="text-sm text-gray-500">Difficulty: {q.difficulty}</p>
                <ul className="mt-2">
                  {q.options.map((option, idx) => (
                    <li key={idx} className={`ml-4 ${idx === q.correctIndex ? "text-green-600 font-bold" : "text-black"}`}>
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <p className="text-red-500">No questions to review.</p>
          )}
        </ul>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleConfirmTest}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "✅ Confirm & Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
