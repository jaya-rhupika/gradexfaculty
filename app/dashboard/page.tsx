"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Test {
  id: string;
  subject: string;
  classId: string;
  scheduledDate: string;
}

interface ClassRequest {
  studentRegNo: string;
  studentName: string;
  classId: string;
}

interface TeacherClass {
  classId: string;
  className: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);

  useEffect(() => {
    // Fetch test data (replace this with API call if needed)
    const dummyTests = [
      { id: "1", subject: "Math", classId: "A1", scheduledDate: "2025-04-01" },
      { id: "2", subject: "Science", classId: "B2", scheduledDate: "2025-04-05" },
    ];
    setTests(dummyTests);

    // Fetch class requests (replace with API call)
    const dummyRequests = [
      { studentRegNo: "2025001", studentName: "Alice", classId: "A1" },
      { studentRegNo: "2025002", studentName: "Bob", classId: "B2" },
    ];
    setClassRequests(dummyRequests);

    // Fetch teacher's classes (replace with API call)
    const dummyClasses = [
      { classId: "A1", className: "Math Class" },
      { classId: "B2", className: "Science Class" },
    ];
    setTeacherClasses(dummyClasses);
  }, []);

  const handleApprove = (regNo: string) => {
    console.log(`Approved student: ${regNo}`);
    setClassRequests(classRequests.filter((req) => req.studentRegNo !== regNo));
  };

  const handleReject = (regNo: string) => {
    console.log(`Rejected student: ${regNo}`);
    setClassRequests(classRequests.filter((req) => req.studentRegNo !== regNo));
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-5">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul>
          <li className="mb-2">
            <Link href="/profile" className="text-white hover:text-gray-400">
              Profile
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/question-bank" className="text-white hover:text-gray-400">
              Public Question Bank
            </Link>
          </li>
          <h3 className="text-lg font-bold mt-4">Your Classes</h3>
          {teacherClasses.map((cls) => (
            <li key={cls.classId} className="mb-2">
              <Link href={`/class/${cls.classId}`} className="text-white hover:text-gray-400">
                {cls.className}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="w-full text-left text-red-500 hover:text-red-300 mt-4"
              onClick={() => router.push("/logout")}
            >
              Log Out
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">Scheduled Tests</h1>

        <div className="bg-white text-black rounded-lg p-5 shadow-lg">
          {tests.length === 0 ? (
            <p>No scheduled tests.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Subject</th>
                  <th className="p-2">Class ID</th>
                  <th className="p-2">Scheduled Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b">
                    <td className="p-2">{test.subject}</td>
                    <td className="p-2">{test.classId}</td>
                    <td className="p-2">{test.scheduledDate}</td>
                    <td className="p-2">
                      <Link
                        href={`/test/${test.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Start Test
                      </Link>
                      <Link
                        href={`/review/${test.id}`}
                        className="ml-4 text-gray-500 hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Classroom Join Requests */}
        <h2 className="text-2xl font-bold mt-5">Join Requests</h2>
        <div className="bg-white text-black rounded-lg p-5 shadow-lg">
          {classRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <ul>
              {classRequests.map((req) => (
                <li key={req.studentRegNo} className="border-b p-2 flex justify-between">
                  <span>{req.studentName} ({req.studentRegNo}) - Class: {req.classId}</span>
                  <div>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleApprove(req.studentRegNo)}>Approve</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleReject(req.studentRegNo)}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create Test Button */}
        <div className="mt-5">
          <Link
            href="/dashboard/question-bank"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Test
          </Link>
        </div>
      </main>
    </div>
  );
}
