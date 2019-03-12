/* EXTRA api lendItem response with merging */

import { WbmaMergableItem } from "./wbma-mergable-item";
import { WbmaMergableUserItem } from "./wbma-mergable-useritem";

export interface LendItem extends WbmaMergableItem, WbmaMergableUserItem {
    starts: string;
    ends: string;
    acceptable: boolean;
    rejectable: boolean;
    cancellable: boolean;
    item_id: number;
    lend_id: number;
    user_id: number;
    user_name?: string;
    status: string;
    item_title?: string;
    item_description?: string;
    item_category?: number;
    item_category_name?: string;
    item_thumb?: string;
    readed?: boolean;
  }
