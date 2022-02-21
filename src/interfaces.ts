export interface IData {
  impact: string;
  highlightText: string;
  minicardTitle: string;
  group: string;
  replacements: string[];
  explanation: string;
  cardLayout: { group: string };
  text: string;
  begin: number;
  category: string;
}

export interface IAlert {
  alerts: IData[];
}

export interface IOriginalWord {
  begin: number;
  end: number;
  len: number;
}
