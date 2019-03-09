import { WbmaMergableItem } from "./wbma-mergable-item";

export interface UnfeedbackedItem extends WbmaMergableItem {
    item: number;
    lend_id: number;
    user_id: number;
    starts: string;
    ends: string;
    }