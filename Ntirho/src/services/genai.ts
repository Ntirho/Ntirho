import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../environments/environment.development';
import { Certificate, Experience, Job, UserAttributes } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GenaiService {
  // AI Client
  ai = new GoogleGenAI({ apiKey: environment.GEMINI_API_KEY});
  model = 'gemini-2.5-flash-lite';
  models = ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

  // Function to handle communication
  async Tester() {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: 'What is AI according to AIMA'
    });

    // Display it to the log
    console.log(response.text);
  }

  // Job Matching
  async JobMatcher(input: string){
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: input
    })

    return response;
  }

  // Sepedi skills extractor
  async extractSepediSkills(transcript: string){
    const prompt = `
      Analyze the following Sepedi text **${transcript}** and extract all relavent skills implied in the sentence. 
      Focus on work-related, technical, or practical abilities. 
      Return the skills as a comma-separated list in English. 
      Ignore personal traits or unrelated information.

      *If no skills can be extracted, return only the string 'other'. No explaination.*
      `;

    const prompt2 = `
      Hlahloba polelo ye e latelago gomme o ntšhe bokgoni bjo bo amanago le mošomo wo moseki a nyakago go o dira. 
      Tsepamisa maikutlo go bokgoni bja mošomo bjalo ka go aga, go hlwekiša, go lema, bj.bj. Fa bokgoni bjoo bjalo ka lenaneo la mantšu a a kgaogantšwego ka koma ka Seisemane. 
      Se ke se tlogele ditšhwayo tša botho goba dikeletšo tša kakaretšo.

      **${transcript}**
      `;

    const response1 = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt
    });

    const response2 = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt2
    }).then(x => {
      // Console checks
      console.log('Response 1: ', x.text);
    });;

    return response1;
  }

  // English skills extractor
  async extractEnglishSkills(transcript: string){
    const prompt = `
      Analyze the following the text **${transcript}** and extract all skills mentioned. 
      Focus on work-related, technical, or practical abilities. 
      Return the skills as a comma-separated list in English. 
      Ignore personal traits or unrelated information.
      `;

    const prompt2 = `
      Analyze the sentence **${transcript}** and extract all relevant skills or work categories implied by the user's job interests. 
      Focus on practical, job-related abilities such as construction, gardening, cleaning, etc. Return the skills as a comma-separated list in lowercase. 
      Ignore personal traits or general preferences.

      *If no skills can be extracted, return only the string 'other'. No explaination.*
      `;

    const response2 = this.ai.models.generateContent({
      model: this.model,
      contents: prompt2
    });

    return response2;
  }

  // Language Translators
  async sepediTranslation(input: string){
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: input
    })

    return response;
  }

  // Prompt 
  promptBuilder0(jobs: Job[], user_profile: UserAttributes){
    const prompt = `
      You are an AI job matching expert. Your goal is to analyze a user's skills and preferences and match them with a provided list of job opportunities.

      User Profile:
      - About: ${user_profile.about}
      - Skills: ${user_profile.skills}
      - Interests: ${user_profile.interests}

      Available Jobs:
      ${jobs.map(job => `
      - **${job.title}[${job.job_id}]** at ${job.company} in ${job.location}
        - Required Skills: ${job.skills.join(', ')}
        - Description: ${job.description}
      `).join('\n')}

      Instructions:
      1. Compare the user's skills and preferences with each job.
      2. Assign a "matchScore" from 0 to 100 based on skill overlap and location relevance.
      3. Identify which skills match between the user and each job.
      4. Return the result as a JSON array of objects with the following structure:

      [
        {
          "job_id": number,
          "title": string,
          "company": string,
          "location": string,
          "description": string,
          "matchScore": number,
          "matchedSkills": string[]
        },
        ...
      ]

      Only return the JSON array. Do not include any explanation or extra text.
      `;

      return prompt;
  }

  // Prompt 
  promptBuilder(jobs: Job[], user_profile: UserAttributes, experiences: Experience[], certificates: Certificate[]){
    const prompt = `
      You are an AI job matching expert. Your goal is to analyze a user's skills and preferences and match them with a provided list of job opportunities.

      User Profile:
      - About: ${user_profile.about}
      - Skills: ${user_profile.skills}
      - Interests: ${user_profile.interests}
      - Experiences: ${experiences}
      - Certificates: ${certificates}

      Available Jobs:
      ${jobs.map(job => `
      - **${job.title}[${job.job_id}]** at ${job.company} in ${job.location}
        - Required Skills: ${job.skills.join(', ')}
        - Description: ${job.description}
      `).join('\n')}

      Instructions:
      1. Compare the user's skills and preferences with each job.
      2. Assign a "matchScore" from 0 to 100 based on skill overlap and location relevance.
      3. Identify which skills match between the user and each job.
      4. Return the result as a JSON array of objects with the following structure:

      [
        {
          "job_id": number,
          "title": string,
          "company": string,
          "location": string,
          "description": string,
          "matchScore": number,
          "matchedSkills": string[]
        },
        ...
      ]

      Only return the JSON array. Do not include any explanation or extra text.
      `;

      return prompt;
  }

  sepediToEnglishPromptBuilder(sepediTranscript: string) {
    const prompt = `
      You are a language translator expert. Your goal is to translate sepedi text to english.

      Sepedi Text: **${sepediTranscript}**

      Only return the English text.
      `;

    return prompt;
  }
}
