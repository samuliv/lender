export interface OpenCageDataResponse {
    results: OpenCageDataResponseResults[];
}

export interface OpenCageDataResponseResults {
    components: OpenCageDataResponseResultComponents;
    geometry: OpenCageDataResponseGeometry;
    formatted: string;
}

export interface OpenCageDataResponseResultComponents {
    town?: string;
    city?: string;
    suburb: string;
    state: string;
    country: string;
    continent: string;
}

export interface OpenCageDataResponseGeometry {
    lat: number;
    lng: number;
}