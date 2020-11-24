import { User } from './User';

export class Item {
  url: string;
  done?: boolean;
  createdBy: User;
}
