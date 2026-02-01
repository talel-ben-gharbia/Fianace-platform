export type EmojiObject = {
    emoji: string;
};

export type ITransactionData = {
    emoji : string;
    title : string;
    category : string;
    amount : string;
    date : Date |null ;
    transactionType?: string;
    _id?: string;
};

export type ChartPoint = {
  x: Date;
  y: number;
  type?: string;
  icon?: string;
  category?: string;
};
