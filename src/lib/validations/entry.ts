import { z } from 'zod';

export const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Movie', 'TV Show'], {
    errorMap: () => ({ message: 'Type must be either "Movie" or "TV Show"' }),
  }),
  director: z.string().min(1, 'Director is required'),
  budget: z.number().positive('Budget must be a positive number'),
  location: z.string().min(1, 'Location is required'),
  duration: z.string().min(1, 'Duration is required'),
  year: z.number().int().min(1800).max(new Date().getFullYear() + 10, 'Year must be valid'),
});

export const updateEntrySchema = entrySchema.partial();

export type EntryInput = z.infer<typeof entrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
