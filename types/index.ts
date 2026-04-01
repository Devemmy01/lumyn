export interface IPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriber {
  _id?: string;
  email: string;
  createdAt: Date;
}

export interface IContact {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface Product {
  name: string;
  tagline: string;
  description: string;
  href: string;
  status: "live" | "beta" | "development";
  accentColor: string;
}
