/* WBMA login info response interface */

import { User } from '../interfaces/user';

export interface LoginInfo {
    message: string;
    token?: string;
    user?: User;
  }