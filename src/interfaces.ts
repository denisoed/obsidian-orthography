export interface IData {
  impact: string;
  highlightText: string;
  minicardTitle: string;
  group: string;
  replacements: string[];
  explanation: string;
  cardLayout: { group: string };
}

export interface IAlert {
  alerts: IData[];
}
