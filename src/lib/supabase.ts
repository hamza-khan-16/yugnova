import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Reel = {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  poster: string;
  video: string;
  likes: string;
  order_index: number;
  created_at?: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  image: string;
  link: string;
  order_index: number;
  created_at?: string;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  is_popular: boolean;
  order_index: number;
  created_at?: string;
};

export type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published_at: string;
  order_index: number;
  created_at?: string;
};
