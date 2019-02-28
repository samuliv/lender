export interface Message {
  id: number;
  message: string;
  from: number;
  time: string;
  ago: string;
  readed: boolean;
  data_binding?: number;
  data_id?: number;
  }
