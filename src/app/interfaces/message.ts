export interface Message {
  id: number;
  message: string;
  to?: number;
  from?: number;
  time: string;
  ago: string;
  readed: boolean;
  binded_user?: number;
  binded_item?: number;
  sender_name?: string;
  recipient_name?: string;
  }
