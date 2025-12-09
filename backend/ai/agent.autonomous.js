import axios from "axios";
import fs from "fs";

let AIX_MEMORY = {
    tasks: [],
    lastAction: null,
};

// 1) Local AI model call (Ollama)
async function localAI(prompt) {
    try {
        const res = await axios.post("http://localhost:11434/api/generate", {
            model: "phi3:mini",
            prompt: prompt,
            stream: false
        });

        return res.data.response;
    } catch (err) {
        return "Boss, local AI चालू नाही. CMD मध्ये चलवा:  ollama run phi3:mini";
    }
}

// 2) Autonomous Brain
export async function AIX_autonomousEngine(userCommand) {
    AIX_MEMORY.tasks.push(userCommand);

    const planPrompt = `
You are AIX — a super autonomous agent.
User said: "${userCommand}"

Create:
1) Understanding of task  
2) Step-by-step plan  
3) Real actions you can execute  
4) Final Report format  
`;

    const brain = await localAI(planPrompt);

    AIX_MEMORY.lastAction = brain;

    return brain;
}