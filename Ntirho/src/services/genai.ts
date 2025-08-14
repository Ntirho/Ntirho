import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../environments/environment.development';
import { Job, UserAttributes } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GenaiService {
  // AI Client
  ai = new GoogleGenAI({ apiKey: environment.GEMINI_API_KEY});

  // Function to handle communication
  async Tester() {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: 'What is AI according to AIMA'
    });

    // Display it to the log
    console.log(response.text);
  }

  // Job Matching
  async JobMatcher(input: string){
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: input
    })

    return response;
  }

  // Prompt 
  promptBuilder(jobs: Job[], user_profile: UserAttributes){
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
}
