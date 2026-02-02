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

export type IChartSeriesPoint = {
  x: number;
  y: number;
  type?: string;
  icon?: string;
  tCategory?: string;
  rawDate: Date;
};
