/* Browse Search filtering options */

export interface SearchFilteringOptions {
    filterby_distance: boolean;
    filterby_string: boolean;
    filterby_category: boolean;
    filterby_maxprice: boolean;
    current_lat?: number;
    current_lon?: number;
    max_distance?: number;
    search_string?: string;
    categories?: number[];
    max_price?: number;
}