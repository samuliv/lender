/* Extra API unfeedbacked lend/borrow item response */

import { WbmaMergableItem } from "./wbma-mergable-item";
import { WbmaMergableUserItem } from "./wbma-mergable-useritem";

export interface UnfeedbackedItem extends WbmaMergableItem, WbmaMergableUserItem {
    item_id: number;
    lend_id: number;
    user_id: number;
    starts: string;
    ends: string;
    user_name?: string;
    }