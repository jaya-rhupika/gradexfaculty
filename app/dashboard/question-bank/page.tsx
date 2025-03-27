"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function McqGenerator() {
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState<{ question: string; options: Record<string, string>; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<{ text: string; answer: string }[]>([]);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (response.ok) {
        setMcqs(data.mcqs || []);
        setSelectedQuestions([]); // Clear previous selections
      } else {
        setError(data.error || "Failed to generate MCQs");
      }
    } catch (err) {
      setError("An error occurred while fetching MCQs.");
    }

    setLoading(false);
  };

  const toggleQuestionSelection = (questionText: string, answer: string) => {
    setSelectedQuestions((prev) =>
      prev.some((q) => q.text === questionText)
        ? prev.filter((q) => q.text !== questionText)
        : [...prev, { text: questionText, answer }]
    );
  };

  const handleReviewQuestions = () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question before proceeding.");
      return;
    }

    const query = encodeURIComponent(JSON.stringify(selectedQuestions));
    router.push(`/dashboard/review?questions=${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">
      <h1 className="text-2xl font-bold mb-4">MCQ Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
          className="border p-2 rounded-lg mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
          Generate MCQs
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="w-full max-w-2xl">
        {mcqs.map((mcq, index) => (
          <li key={index} className="border p-4 rounded-lg mb-2 shadow-md">
            <div className="flex items-start">
              <input
                type="checkbox"
                className="mr-2 mt-1"
                checked={selectedQuestions.some((q) => q.text === mcq.question)}
                onChange={() => toggleQuestionSelection(mcq.question, mcq.answer)}
              />
              <div>
                <p className="font-semibold">{mcq.question}</p>
                <ul className="mt-2">
                  {Object.entries(mcq.options).map(([key, value]) => (
                    <li key={key} className="ml-4">
                      {key}: {value}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-green-600 font-semibold">Answer: {mcq.answer}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedQuestions.length > 0 && (
        <button
          className="mt-4 bg-green-500 text-white p-2 rounded-lg"
          onClick={handleReviewQuestions}
        >
          ➡️ Review Selected Questions ({selectedQuestions.length})
        </button>
      )}
    </div>
  );
}
