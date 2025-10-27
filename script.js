// Skedari: script.js

import { GoogleGenAI } from "@google/genai";

// Inicializon GoogleGenAI. 
// Ajo automatikisht gjen çelësin API nga variabla e mjedisit GEMINI_API_KEY.
const ai = new GoogleGenAI({});

async function merrPergjigjeGemini() {
    // Specifikon modelin që do të përdoret
    const model = "gemini-2.5-flash"; 
    
    // Kërkesa (prompt) që do t'i dërgoni AI-së
    const prompt = "Shkruaj një poezi të shkurtër prej katër vargjesh për diellin dhe detin.";

    console.log(`Duke dërguar kërkesën: "${prompt}"`);

    try {
        // Thirrja API për të gjeneruar përmbajtje
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        // Merr tekstin e përgjigjes
        const text = response.text;
        
        console.log("\n--- Përgjigjja e Gemini-t ---");
        console.log(text);
        console.log("----------------------------");

    } catch (error) {
        console.error("Ndodhi një gabim gjatë thirrjes së API-së së Gemini:", error);
    }
}

merrPergjigjeGemini();
