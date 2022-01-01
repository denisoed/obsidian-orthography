import { IData } from 'src/interfaces';

export const formatAlerts = (alerts: IData[], markers: any): any => {
  const sortedAlerts = alerts.sort((a: any, b: any) => a.begin - b.begin);
  return sortedAlerts.map((item, i) => Object.assign({}, item, markers[i]));
};

export const removePremium = (alerts: IData[]): any => {
  return alerts.filter((alert: any) => alert.hidden !== true);
};
