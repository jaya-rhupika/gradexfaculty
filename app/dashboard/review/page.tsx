"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedQuestions, setSelectedQuestions] = useState<{ text: string; answer: string }[]>([]);

  useEffect(() => {
    const questionsFromUrl = searchParams.get("questions");
    if (questionsFromUrl) {
      try {
        setSelectedQuestions(JSON.parse(decodeURIComponent(questionsFromUrl)));
      } catch (error) {
        console.error("Error parsing questions from URL:", error);
      }
    }
  }, [searchParams]);

  const handleRemoveQuestion = (questionText: string) => {
    setSelectedQuestions((prev) => prev.filter(q => q.text !== questionText));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Review Selected Questions</h1>

      {selectedQuestions.length > 0 ? (
        <ul className="space-y-4">
          {selectedQuestions.map((question, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center">
              <span className="text-black">{question.text}</span>
              <button
                className="text-red-500 font-bold"
                onClick={() => handleRemoveQuestion(question.text)}
              >
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No questions selected.</p>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <button
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600 transition"
          onClick={() => router.push(`/dashboard/question-bank?questions=${encodeURIComponent(JSON.stringify(selectedQuestions))}`)}
        >
          🔙 Back to Question Bank
        </button>
        <button
  onClick={() => router.push(`/dashboard/create-test?questions=${encodeURIComponent(JSON.stringify(selectedQuestions))}`)}
  className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition"
>
  ➡️ Proceed to Create Test
</button>

      </div>
    </div>
  );
}
