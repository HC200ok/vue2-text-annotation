export interface Annotation {
  content: string;
  annotation: string;
  start: number;
  end: number;
}
export interface Chunk {
  type: string;
  annotation?: string;
  content: string;
  start?: number;
  end?: number;
}
