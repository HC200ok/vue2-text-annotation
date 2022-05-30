export interface Annotation {
  content: string;
  category: string;
  start: number;
  end: number;
}
export interface Chunk {
  type: string;
  category?: string;
  content: string;
  start?: number;
  end?: number;
}
