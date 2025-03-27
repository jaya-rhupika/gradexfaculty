import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic'; // Ensures this API route is always server-side

export async function POST(req) {
    try {
        const { topic, numMcqs = 30 } = await req.json();

        // **HARD-CODED API KEY (Not Recommended for Production)**
        const apiKey = "AIzaSyDAvxz3ZlvgJ25VRiF2e4l-lFNY07wI5fo";

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `Generate ${numMcqs} multiple-choice questions about ${topic}.
        Provide output in this EXACT format:
        [Full Question Text]_[Option A]_[Option B]_[Option C]_[Option D]_[A/B/C/D]`;

        const result = await model.generateContent(prompt);
        const textResponse = await result.response.text();
        const mcqs = parseMcqText(textResponse);

        return Response.json({ mcqs });
    } catch (error) {
        console.error("Error generating MCQs:", error);
        return Response.json({ error: "Failed to generate MCQs" }, { status: 500 });
    }
}

// Function to parse the response into structured MCQs
function parseMcqText(mcqsText) {
    return mcqsText.split("\n").map(entry => {
        const parts = entry.split("_");
        if (parts.length === 6 && ["A", "B", "C", "D"].includes(parts[5])) {
            return {
                question: parts[0],
                options: { A: parts[1], B: parts[2], C: parts[3], D: parts[4] },
                answer: parts[5]
            };
        }
        return null;
    }).filter(mcq => mcq !== null);
}
