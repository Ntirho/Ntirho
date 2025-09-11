import { UUID } from "crypto";

export interface Job {
  job_id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  date_posted?: string;
}

export interface ProfileFormValues {
  name: string;
  location: string;
  skills: string[];
}

export interface JobMatch {
  job_id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  matchScore: number; // 0 to 100
  matchedSkills: string[];
}

export interface JobMatchesOutput {
  matches: JobMatch[];
}

export interface JobMatchesInput {
  skills: string[];         // e.g. ['retail', 'hospitality']
  preferences: string[];    // e.g. ['Polokwane', 'full-time']
}

/**
 * The following interface are for the tables (DB)
 */
export interface User {
  user_id?: number;
  full_names: string;
  date_of_birth: string;
  email: string;
  code: string;
  cell: string;
  sex: string;
  ethnicity?: string;
  home_language?: string;
  location?: string;
  driver_license: boolean;
  has_disability: boolean;
  date_created?: string; // ISO timestamp
}

export interface AppUser {
  id?: string; // UUID from auth.users
  full_names: string;
  date_of_birth: string; // 'YYYY-MM-DD'
  email: string;
  code: string;
  cell: string;
  sex: string;
  ethnicity?: string;
  home_language?: string;
  location?: string;
  driver_license: boolean;
  has_disability: boolean;
  date_created?: string; // ISO timestamp
}


export interface UserAttributes {
  user_id: string;
  skills: string[];
  interests: string[];
  about: string;
  date_updated?: string;
}

export interface Disability {
  user_id: string;
  disability: string;
  date_created?: string;
}

// export interface Job {
//   job_id: number;
//   company: string;
//   location: string;
//   description: string;
//   skills: string[];
//   date_posted?: string;
// }

export interface Education {
  qualification_id: number;
  user_id: string;
  institution?: string;
  qualification?: string;
  start_date?: string;
  completion_date?: string;
  average?: number;
  name?: string,
  date_created?: string;
}

export interface Experience {
  experience_id: number;
  user_id: string;
  organization?: string,
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  date_created?: string;
}

export interface Certificate {
  certificate_id: number;
  user_id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string;
  date_created?: string;
}

export interface Subject {
  subject_id: number,
  qualification_id: number,
  name: string,
  average: number,
  date_created: string
}

/**
 * End of interfaces for the tables (DB)
 */

export const homeLanguages = [
  'Afrikaans',
  'English',
  'isiNdebele',
  'isiXhosa',
  'isiZulu',
  'Sepedi',
  'Sesotho',
  'Setswana',
  'siSwati',
  'Tshivenda',
  'Xitsonga',
  'South African Sign Language'
];


export const dummyJobs : Job[] = [
  {
    job_id: 1,
    title: 'General Worker',
    company: 'BuildIt Polokwane',
    location: 'Polokwane',
    skills: ['construction', 'retail'],
    description: 'Looking for a general worker to assist with various tasks at our hardware store. Responsibilities include stocking shelves, assisting customers, and maintaining a clean work environment.'
  },
  {
    job_id: 2,
    title: 'Farm Hand',
    company: 'Zebediela Citrus Estate',
    location: 'Zebediela',
    skills: ['farming'],
    description: 'Seeking a dedicated farm hand for our citrus estate. Duties involve irrigation, pest control, and harvesting. Experience with farm machinery is a plus.'
  },
  {
    job_id: 3,
    title: 'Cashier',
    company: 'Shoprite Mankweng',
    location: 'Mankweng',
    skills: ['retail'],
    description: 'Friendly and reliable cashier needed for a busy supermarket. Must be good with numbers and have excellent customer service skills.'
  },
  {
    job_id: 4,
    title: 'Hotel Cleaner',
    company: 'Sun Meropa',
    location: 'Polokwane',
    skills: ['hospitality', 'domestic_work'],
    description: 'We are hiring a cleaner to maintain the high standards of our hotel rooms and public areas. Attention to detail is a must.'
  },
  {
    job_id: 5,
    title: 'Delivery Driver',
    company: 'FastFlow Couriers',
    location: 'Polokwane',
    skills: ['driving'],
    description: 'Experienced driver with a valid license needed for local deliveries. Must have a good knowledge of the Polokwane area.'
  },
    {
    job_id: 6,
    title: 'Gardener',
    company: 'Jane Furse Gardens',
    location: 'Jane Furse',
    skills: ['farming', 'other'],
    description: 'Passionate gardener required to maintain several private gardens. Knowledge of local plants and landscaping is essential.'
  },
  {
    job_id: 7,
    title: 'Waiter/Waitress',
    company: 'The Eatery',
    location: 'Mankweng',
    skills: ['hospitality'],
    description: 'Energetic waiting staff needed for a popular restaurant. Must be a team player with a positive attitude.'
  },
  {
    job_id: 8,
    title: 'Security Guard',
    company: 'SafeGuard Security',
    location: 'Zebediela',
    skills: ['other'],
    description: 'Vigilant security guard required for night shifts. PSIRA registration is mandatory.'
  }
];

export const dummyJobMatches: JobMatch[] = [
  {
    job_id: 1,
    title: 'General Worker',
    company: 'BuildIt Polokwane',
    location: 'Polokwane',
    description: 'Looking for a general worker to assist with various tasks at our hardware store. Responsibilities include stocking shelves, assisting customers, and maintaining a clean work environment.',
    matchScore: 82,
    matchedSkills: ['retail', 'construction']
  },
  {
    job_id: 2,
    title: 'Farm Hand',
    company: 'Zebediela Citrus Estate',
    location: 'Zebediela',
    description: 'Seeking a dedicated farm hand for our citrus estate. Duties involve irrigation, pest control, and harvesting. Experience with farm machinery is a plus.',
    matchScore: 74,
    matchedSkills: ['farming']
  },
  {
    job_id: 3,
    title: 'Cashier',
    company: 'Shoprite Mankweng',
    location: 'Mankweng',
    description: 'Friendly and reliable cashier needed for a busy supermarket. Must be good with numbers and have excellent customer service skills.',
    matchScore: 88,
    matchedSkills: ['retail']
  },
  {
    job_id: 4,
    title: 'Hotel Cleaner',
    company: 'Sun Meropa',
    location: 'Polokwane',
    description: 'We are hiring a cleaner to maintain the high standards of our hotel rooms and public areas. Attention to detail is a must.',
    matchScore: 79,
    matchedSkills: ['hospitality']
  },
  {
    job_id: 5,
    title: 'Delivery Driver',
    company: 'FastFlow Couriers',
    location: 'Polokwane',
    description: 'Experienced driver with a valid license needed for local deliveries. Must have a good knowledge of the Polokwane area.',
    matchScore: 70,
    matchedSkills: ['driving']
  },
  {
    job_id: 6,
    title: 'Gardener',
    company: 'Jane Furse Gardens',
    location: 'Jane Furse',
    description: 'Passionate gardener required to maintain several private gardens. Knowledge of local plants and landscaping is essential.',
    matchScore: 65,
    matchedSkills: ['farming']
  },
  {
    job_id: 7,
    title: 'Waiter/Waitress',
    company: 'The Eatery',
    location: 'Mankweng',
    description: 'Energetic waiting staff needed for a popular restaurant. Must be a team player with a positive attitude.',
    matchScore: 76,
    matchedSkills: ['hospitality']
  },
  {
    job_id: 8,
    title: 'Security Guard',
    company: 'SafeGuard Security',
    location: 'Zebediela',
    description: 'Vigilant security guard required for night shifts. PSIRA registration is mandatory.',
    matchScore: 60,
    matchedSkills: ['other']
  }
];
