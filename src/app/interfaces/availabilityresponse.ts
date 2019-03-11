/* EXTRA api availability check response interface */

export interface AvailabilityResponse {
    available: boolean;
    feedback: number;
    feedback_positive: number;
    feedback_negative: number;
}
