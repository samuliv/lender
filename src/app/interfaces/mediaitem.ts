import { MediaData } from './mediadata';

export interface MediaItem {
    tag_id: number;
    file_id: number;
    tag: string;
    filename: string;
    filesize: number;
    title: string;
    description: string;
    user_id: number;
    media_type: string;
    mime_type: string;
    time_added: string;
    media_data?: MediaData;
}