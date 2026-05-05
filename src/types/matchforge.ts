export type ListingType = 'Case Competition' | 'Hackathon' | 'Co-founder' | 'Learning Partner';

export interface MatchProfile {
  id: string;
  full_name?: string;
  headline?: string;
  roles: string[];
  bio: string;
  skills: string[];
  education: any[];
  experience: any[];
  location?: string;
  grad_year?: number;
  current_term?: number;
  linkedin_url?: string;
  whatsapp_number?: string;
  is_complete: boolean;
}

export interface MatchListing {
  id: string;
  user_id: string;
  type: ListingType;
  title: string;
  description: string;
  required_skills: string[];
  status: 'Open' | 'Closed';
  created_at: string;
  profiles?: MatchProfile;
}
