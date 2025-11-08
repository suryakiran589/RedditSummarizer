import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'

dotenv.config()



const API_KEY:string = process.env.GEMINI_API_KEY  || ""

const ai = new GoogleGenAI({apiKey:API_KEY});

export default async function getSummary(title:string,comments:Array<string>) {
  try{

    console.log("in get summary")
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `i am doing a project where user gives a reddit post link and for title ${title} and comments ${comments} you have to analyse them and give a honest and crisp on first line title and from nextline a two line summary and i dont want '*'s in it  `,
    });
    return response.text
  }
  catch(e){
    throw new Error("something went wrong")
  }
}
