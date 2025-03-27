"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateTestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [questions, setQuestions] = useState<{ text: string; answer: string; difficulty: string }[]>([]);
  const [totalTime, setTotalTime] = useState(30);
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState(""); // Selected Class ID
  
  // Mock Class IDs (Replace with API fetch if needed)
  const classOptions = ["ClassA", "ClassB", "ClassC", "ClassD"];

  useEffect(() => {
    const selectedQuestions = searchParams.get("questions");
    if (selectedQuestions) {
      setQuestions(JSON.parse(decodeURIComponent(selectedQuestions)));
    }
  }, [searchParams]);

  const getQuestionCountByDifficulty = (difficulty: string) =>
    questions.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()).length;

  const handleSaveTest = async () => {
    if (!classId) {
      alert("Please select a Class ID!");
      return;
    }

    setLoading(true);
    const testData = {
      classId,
      totalQuestions: questions.length,
      easy: getQuestionCountByDifficulty("Easy"),
      medium: getQuestionCountByDifficulty("Medium"),
      difficult: getQuestionCountByDifficulty("Difficult"),
      totalTime,
      questions,
    };

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to save test!");
      }
    } catch (error) {
      console.error("Error saving test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-black">📝 Create Test</h1>

        <div className="grid gap-4">
          {/* Test Summary */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
            <h2 className="text-lg font-semibold text-black">Test Summary</h2>
            <p className="text-black"><strong>Total Questions:</strong> {questions.length}</p>
            <p className="text-black"><strong>Easy:</strong> {getQuestionCountByDifficulty("Easy")}</p>
            <p className="text-black"><strong>Medium:</strong> {getQuestionCountByDifficulty("Medium")}</p>
            <p className="text-black"><strong>Difficult:</strong> {getQuestionCountByDifficulty("Difficult")}</p>
          </div>

          {/* Time Input */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
            <label className="block font-semibold mb-2 text-black">Set Total Quiz Time (Minutes):</label>
            <input
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(parseInt(e.target.value))}
              className="p-2 border rounded w-full text-black bg-white border-gray-300"
            />
          </div>

          {/* Class ID Selection */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
            <label className="block font-semibold mb-2 text-black">Select Class ID:</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="p-2 border rounded w-full text-black bg-white border-gray-300"
            >
              <option value="">-- Select Class --</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            {/* Back to Review Button */}
            <button
              onClick={() => router.back()}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition"
            >
              🔙 Back to Review
            </button>

            {/* Save Test Button */}
            <button
              onClick={handleSaveTest}
              className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "✅ Save Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
