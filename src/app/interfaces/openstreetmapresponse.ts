/* OpenStreetMapService repsponse interfaces */

export interface OpenStreetMapResponse {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    address: OpenStreetMapAddress;
}

export interface OpenStreetMapAddress {
    village?: string;
    state_district?: string;
    state?: string;
    postcode: string;
    country: string;
    country_code: string;
    town?: string;
    city?: string;
    suburb?: string;
}