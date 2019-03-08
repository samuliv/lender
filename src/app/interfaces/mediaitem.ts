import { MediaData } from './mediadata';

export interface Thumbnails {
    w160: string;
    w320: string;
    w640: string;
}

export interface MediaItem {
    tag_id: number;
    file_id: number;
    tag: string;
    filename: string;
    filesize: number;
    title: string;
    description: string;
    user_id: number;
    user_name?: string;
    location?: string;
    media_type: string;
    mime_type: string;
    time_added: string;
    media_data?: MediaData;
    thumbnails?: Thumbnails;
    distance?: string;
    item_thumb: string;
    user_score?: number;
    user_feedback_positive?: number;
    user_feedback_negative?: number;
}