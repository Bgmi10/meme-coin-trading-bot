import Groq from "groq-sdk";
require("dotenv").config();

const groq = new Groq({ 
    apiKey: process.env.GROQ_LLM_API_KEY
});

export default async function getTokenLlm(contents: any) {
   try {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: contents,
            },
            {
                role: "system",
                content: "You are an AI agent that needs to tell me if this tweet is about buying a solana token. return me either the address of the token or return me null if you cant find a solana token address i this tweet. Only return if it says its is a bull post. note you dont have to return the long text return the token either null. youre returing the text with I analyzed the tweet and found that it's a bull post mentioning the Solana token. i dont want this anymore i only need the token address or null in response from you.."
            }
        ],
        model: "llama3-70b-8192"
    });
    return response.choices[0].message.content ?? "null";
   } catch (e) {
    console.log(e);
   } 
}