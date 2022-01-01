export interface IData {
  impact: string;
  highlightText: string;
  minicardTitle: string;
  group: string;
  replacements: string[];
  explanation: string;
  cardLayout: { group: string };
  text: string;
  attributes: any;
  begin: number;
}

export interface IAlert {
  alerts: IData[];
}

export interface IPosition {
  row: number;
  col: number;
  len: number;
}
