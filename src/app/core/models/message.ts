export interface Message {
  //   senderId?: number;
  id?: number;
  dialogId?: number;
  text?: string;
  date?: Date;
  isCurrentUser?: boolean;
  isViewed?: boolean;
}

export interface Dialog {
  id?: number;
  contact?: {
    id?: number;
    avatarImgUrl?: string;
    name?: string;
  };
  lastMessage?: Message;
  unviewedCount?: number;
}