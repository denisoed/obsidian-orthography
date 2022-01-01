import { IData } from 'src/interfaces';

const formatter = (alerts: IData[], markers: any): any => {
  const sortedAlerts = alerts.sort((a: any, b: any) => a.begin - b.begin);
  return sortedAlerts.map((item, i) => Object.assign({}, item, markers[i]));
};

export default formatter;
