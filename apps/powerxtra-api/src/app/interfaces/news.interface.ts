import { Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  snipet: string;
  type: string;
  category?: string;
  tags?: string;
  author: string;
  content?: string;
  createdBy?: string;
  trending: boolean;
  featured: boolean;
  active: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  publishAt: Date
  expireAt: Date
  imageUrl?: string;
  published: boolean;
  status?: string; // published | pending | unpublished
}
