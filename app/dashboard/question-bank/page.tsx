"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cpSync } from "fs";

type Question = {
  questionId: string;
  text: string;
  options: string[];
  answer: string;
  subjectModNumber: string;
  difficulty: string;
};

type Topic = {
  name: string;  
  questions: Question[];
};

const initialTopics: Topic[] = [
  {
    name: "Algebra 1",
    questions: [
      { questionId: "1", text: "What is x in x+2=5?", options: ["1", "2", "3", "4"], answer: "3", subjectModNumber: "Algebra_1", difficulty: "Medium" },
      { questionId: "2", text: "Solve for y: 2y + 4 = 10", options: ["1", "2", "3", "4"], answer: "3", subjectModNumber: "Algebra_1", difficulty: "Medium" }
    ]
  },
  {
    name: "Geometry 2",
    questions: [
      { questionId: "3", text: "Sum of angles in a triangle?", options: ["90", "180", "360", "270"], answer: "180", subjectModNumber: "Geometry_2", difficulty: "Easy" },
      { questionId: "4", text: "What is the area of a circle?", options: ["2πr", "πr²", "πd", "r²"], answer: "πr²", subjectModNumber: "Geometry_2", difficulty: "Medium" }
    ]
  }
];


export default function QuestionBankPage() {
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionId: "",
    text: "",
    options: ["", "", "", ""],
    answer: "",
    subjectModNumber: "",
    difficulty: "Easy"
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    const url = 'http://8tdkmc0-5000.inc1.devtunnels.ms/topicsavail'
    const fetchtopics = async () => {
      try{
        console.log("hello")
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setTopics(data['Message']);
      }
      catch(err){
        console.error("Error fetching topics from URL:", err);
      }
    }
    fetchtopics();
  }, []);  // Empty dependency array to ensure it runs only once
  

  const toggleTopic = (subjectModNumber: string) => {
    setExpandedTopics((prev) =>
      prev.includes(subjectModNumber) ? prev.filter((t) => t !== subjectModNumber) : [...prev, subjectModNumber]
    );
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestions((prev) =>
      prev.some(q => q.questionId === question.questionId) ? prev.filter((q) => q.questionId !== question.questionId) : [...prev, question]
    );
  };

  const handleSelectAll = (questions: Question[], isSelected: boolean) => {
    setSelectedQuestions((prev) => {
      if (isSelected) {
        return prev.filter(q => !questions.some(q2 => q2.questionId === q.questionId));
      } else {
        const newQuestions = questions.filter(q => !prev.some(q2 => q2.questionId === q.questionId));
        return [...prev, ...newQuestions];
      }
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(opt => opt === "") || !newQuestion.answer || !newQuestion.subjectModNumber) {
      alert("Please fill all fields correctly.");
      return;
    }

    const updatedTopics = [...topics];
    let topicFound = updatedTopics.find(t => t.name === newQuestion.subjectModNumber);

    const newQuestionWithId = {
      ...newQuestion,
      questionId: (Math.random() * 100000).toFixed(0) // Generate a unique questionId
    };

    if (topicFound) {
      topicFound.questions.push(newQuestionWithId);
    } else {
      updatedTopics.push({
        name: newQuestion.subjectModNumber,
        questions: [newQuestionWithId]
      });
    }

    setTopics(updatedTopics);
    setExpandedTopics(prev => [...prev, newQuestion.subjectModNumber]);
    setShowAddModal(false);
    setNewQuestion({ questionId: "", text: "", options: ["", "", "", ""], answer: "", subjectModNumber: "", difficulty: "Easy" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Question Bank</h1>

      {/* Add Question Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add Question
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded text-black bg-gray-100"
      />

      {/* Question Bank List */}
      <ul className="space-y-4">
        {topics.map((topic, index) => {
          const isAllSelected = topic.questions.every(q => selectedQuestions.some(sq => sq.questionId === q.questionId));

          return (
            <li key={index} className="p-4 bg-gray-100 rounded shadow text-black">
              <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => toggleTopic(topic.name)}>
                <span className="font-bold text-lg">{topic.name}</span>
                <span className="text-gray-600">{expandedTopics.includes(topic.name) ? "▲" : "▼"}</span>
              </div>

              {expandedTopics.includes(topic.name) && (
                <div className="flex justify-between items-center mb-2">
                  <button
                    className="text-sm text-blue-500 underline"
                    onClick={() => handleSelectAll(topic.questions, isAllSelected)}
                  >
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
              )}

              {expandedTopics.includes(topic.name) && (
                <ul className="space-y-2">
                  {topic.questions.map((question, qIndex) => (
                    <li key={qIndex} className="p-4 bg-white border rounded-lg shadow-md flex items-center justify-between">
                      <span className="text-black">{question.text}</span>
                      <input
                        type="checkbox"
                        checked={selectedQuestions.some(q => q.questionId === question.questionId)}
                        onChange={() => handleSelectQuestion(question)}
                        className="cursor-pointer"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {selectedQuestions.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
            onClick={() => router.push(`/dashboard/review?questions=${encodeURIComponent(JSON.stringify(selectedQuestions))}`)}
          >
            📋 Review Selected Questions
          </button>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
              onClick={() => setShowAddModal(false)}
            >
              ❌
            </button>
            <h2 className="font-bold mb-4">➕ Add New Question</h2>
            <input type="text" placeholder="Question Text" value={newQuestion.text} onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })} className="w-full p-2 mb-2 border rounded text-black bg-gray-100" />
            {newQuestion.options.map((opt, i) => (
              <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => { let opts = [...newQuestion.options]; opts[i] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }} className="w-full p-2 mb-2 border rounded text-black bg-gray-100" />
            ))}
            <input type="text" placeholder="Correct Answer" value={newQuestion.answer} onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })} className="w-full p-2 mb-2 border rounded text-black bg-gray-100" />
            <input type="text" placeholder="Subject_ModNumber (e.g., Algebra_1)" value={newQuestion.subjectModNumber} onChange={(e) => setNewQuestion({ ...newQuestion, subjectModNumber: e.target.value })} className="w-full p-2 mb-2 border rounded text-black bg-gray-100" />
            <select
              value={newQuestion.difficulty}
              onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
              className="w-full p-2 mb-2 border rounded text-black bg-gray-100"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={handleAddQuestion}>➕ Add Question</button>
          </div>
        </div>
      )}
    </div>
  );
}