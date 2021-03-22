export interface Annotation {
  word: string;
  label: string;
}
export interface Entity {
  end_offset: number;
  label: string;
  start_offset: number;
  word: string;
}
export interface Chunk {
  type: string;
  label?: string;
  color?: string;
  content: string;
  newline?: boolean;
}
