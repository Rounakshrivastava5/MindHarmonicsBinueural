export interface SuggestedBook {
  id: string;
  title: string;
  hindi_title?: string;
  author: string;
  hindi_author?: string;
  year: string;
  cover_gradient: string;
  icon: string;
  summary: string;
  hindi_summary?: string;
  key_takeaways: string[];
  hindi_takeaways?: string[];
  pdf_url: string;
  amazon_url: string;
  sample_pages_count: number;
}
