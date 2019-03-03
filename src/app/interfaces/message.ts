export interface Message {
  id: number;
  message: string;
  from: number;
  time: string;
  ago: string;
  readed: boolean;
  binded_user?: number;
  binded_item?: number;
  }
