export interface Genre {
  id: number;
  slug: string;
  title: string;
  hindi_title?: string;
  description: string;
  hindi_description?: string;
  icon: string;
  gradient: string;
  default_affirmations: string[];
  hindi_affirmations?: string[];
}
