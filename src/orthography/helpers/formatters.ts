import { IData } from 'src/interfaces';

export const sortAlerts = (alerts: IData[], markers: any): any => {
  const sortedAlerts = alerts.sort((a: any, b: any) => a.begin - b.begin);
  return sortedAlerts.map((item, i) => Object.assign({}, item, markers[i]));
};

export const formatAlerts = (alerts: IData[]): any => {
  const withoutHidden = alerts.filter((alert: any) => alert.hidden !== true);
  const withoutDuplicate = withoutHidden.reduce((acc, current) => {
    const x = acc.find((item: any) => item.explanation === current.explanation);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return withoutDuplicate;
};
