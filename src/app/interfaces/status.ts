/* Extra API Status reponse */

export interface Status {
    success: boolean;
    unreaded_messages: number,
    unhandled_lends: number;
    unreaded_borrowings: number;
    latest_unreaded_message: number;
    }