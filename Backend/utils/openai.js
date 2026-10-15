import "dotenv/config";

// Uses the Gemini API (file name kept as openai.js so imports don't change).
// If a model is busy / unavailable, the next one in the list is tried.
const MODELS = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// accepts a plain string OR an array of {role: "user" | "assistant", content}
const toGeminiContents = (input) => {
    const messages = Array.isArray(input) ? input : [{ role: "user", content: input }];
    return messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
    }));
};

const getOpenAIAPIResponse = async (input) => {
    let lastError = "unknown";
    const contents = toGeminiContents(input);

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-goog-api-key": process.env.GEMINI_API_KEY
                        },
                        body: JSON.stringify({ contents })
                    }
                );
                const data = await response.json();

                if (data.candidates) {
                    return data.candidates[0].content.parts[0].text;
                }

                lastError = data.error?.message || "unknown";
                console.log(`Gemini error (${model}, try ${attempt}):`, lastError);

                // busy / rate limit -> wait a bit and retry
                if (response.status === 503 || response.status === 429) {
                    await sleep(1500);
                    continue;
                }
                break; // other error -> try next model
            } catch (err) {
                lastError = err.message;
                console.log(err);
                break;
            }
        }
    }

    return "Gemini error: " + lastError;
};

export default getOpenAIAPIResponse;
