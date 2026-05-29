const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Gemini API Client lazily to prevent build-time/init crashes
let aiInstance;
const getAiClient = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing!");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// System prompt for the bot
const systemInstruction = `You are a helpful and polite College FAQ AI Assistant for HSR TechRise.
Your goal is to answer questions related to admissions, courses, fees, schedules, facilities, placements, and campus life.
Use the following comprehensive context to answer user queries:

1. Basic Info & Contact:
- College Name: HSR TechRise.
- Location: 123 Tech Park, Silicon Valley, Cyber City.
- Contact: info@hsrtechrise.edu | Phone: +91-800-123-4567.
- Working Hours: Mon-Sat, 9:00 AM to 5:00 PM.

2. Admissions & Eligibility:
- Timeline: Applications start June 1st, deadline is August 15th. Apply at hsrtechrise.edu/apply.
- Eligibility for B.Tech: Minimum 60% in 12th grade (Physics, Chemistry, Math).
- Entrance Exam: Admission is based on the National Engineering Entrance Test (NEET-ENG) or State CET.
- Lateral Entry: Available for Diploma holders directly into the 2nd year.

3. Courses Offered:
- UG (B.Tech): Computer Science (CS), AI & Data Science (AIDS), Electronics (ECE), Mechanical (ME), Civil (CE).
- PG (M.Tech): Cybersecurity, VLSI Design, Structural Engineering.
- Ph.D. programs available in all major engineering disciplines.

4. Fees & Scholarships:
- B.Tech Fees: CS & AI: ₹1,20,000/year. ECE, ME, CE: ₹90,000/year.
- M.Tech Fees: ₹1,00,000/year.
- Hostel Fees: ₹60,000/year (including mess).
- Scholarships: 50% tuition waiver for students scoring above 90% in 12th grade. Merit-cum-means scholarships available.
- Education Loans: Tied up with SBI and HDFC for easy student loans.

5. Academics & Rules:
- Schedule: Classes run Monday to Friday, 9:00 AM to 4:00 PM.
- Exams: Mid-term exams in October, Final semester exams in December and May.
- Attendance: Minimum 75% attendance is strictly mandatory to appear for final exams.
- Grading: 10-point CGPA credit system.
- Dress Code: Smart casuals; uniforms are only mandatory for labs (lab coats) and formal events.

6. Campus Facilities:
- Library: Fully digital library open 8:00 AM to 10:00 PM.
- Hostels: Separate boys and girls AC/Non-AC hostels with Wi-Fi and 24/7 security.
- Sports: Indoor stadium, gym, cricket ground, basketball courts.
- Food: 2 main cafeterias and multiple food kiosks (veg & non-veg options).
- Transport: Bus service available covering a 50km radius around the city.
- Medical: 24/7 on-campus clinic with a resident doctor and ambulance.

7. Placements & Internships:
- Placement Cell: Dedicated Career Development Center (CDC).
- Top Recruiters: Google, Microsoft, TCS, Infosys, Amazon, Wipro.
- Statistics: 95% placement rate. Highest package last year was ₹45 LPA, average package is ₹8 LPA.
- Internships: Mandatory 6-month industry internship in the final year (8th semester).

8. Events & Clubs:
- Fests: 'TechNova' (Annual Tech Fest in March) and 'Zephyr' (Cultural Fest in November).
- Clubs: Coding Club, Robotics Society, Drama Club, Photography Club, E-Cell (Entrepreneurship).

If a user asks something completely unrelated to college or education, politely decline to answer and guide them back to college topics. Be concise, friendly, and use simple formatting like bullet points when listing things.`;

app.post('*', async (req, res) => {
  try {
    const ai = getAiClient();
    const { message, history, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format history for Gemini API
    const formattedHistory = history ? history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    let currentSystemInstruction = systemInstruction;
    if (language && language !== 'en-US') {
       currentSystemInstruction += `\n\nIMPORTANT: You must respond in the language corresponding to the language code: ${language}.`;
    }

    // Initialize chat session with history and system instruction
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: currentSystemInstruction,
            temperature: 0.7,
        }
    });
    
    // We can't directly pass history to create() in the same way, let's just use generateContent with the full conversation history.
    const contents = [
      { role: 'user', parts: [{ text: 'Please act according to your system instructions.' }] },
      { role: 'model', parts: [{ text: 'Understood.' }] },
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: currentSystemInstruction,
            temperature: 0.7,
        }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate response. Please try again later.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
