/* WBMA description decoded from JSON to this MediaData interface */

export interface MediaData {
    category: number;
    price: number;
    description: string;
    lat?: number;
    lon?: number;
    thumb?: string;
}