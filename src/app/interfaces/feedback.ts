export interface Feedback {
  message: string;
  user_id: number;
  time: string;
  ago: string;
  feedback: number;
  role: string;
  item: number;
  user_name?: string;
  item_name?: string;
  }