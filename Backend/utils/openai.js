import "dotenv/config";

const MODELS = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getOpenAIAPIResponse = async (message) => {
    let lastError = "unknown";

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
                        body: JSON.stringify({
                            contents: [{ role: "user", parts: [{ text: message }] }]
                        })
                    }
                );
                const data = await response.json();

                if (data.candidates) {
                    return data.candidates[0].content.parts[0].text;
                }

                lastError = data.error?.message || "unknown";
                console.log(`Gemini error (${model}, try ${attempt}):`, lastError);

                // busy / rate limit hai to thoda ruk ke dobara try karo
                if (response.status === 503 || response.status === 429) {
                    await sleep(1500);
                    continue;
                }
                break; // dusra error hai, agla model try karo
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