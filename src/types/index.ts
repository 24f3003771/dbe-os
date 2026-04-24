export type UserRole = 'student' | 'moderator' | 'admin' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  totalTomatoesEarned: number;
  tomatoesBalance: number;
  streak: number;
}

export interface MatchScore {
  id: string;
  name: string;
  photoUrl: string | null;
  bio: string | null;
  goal: string;
  skills: string[];
  score: number;
  matchType: string;
  explanation: string;
}

export type OpportunityType = 'COMPETITION' | 'INTERNSHIP';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  name: string;
  organizer: string;
  deadline: Date;
  domain: string;
  difficulty: string;
}
