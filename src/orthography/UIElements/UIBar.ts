import UIControls from './UIControls';
import UIHints from './UIHints';
import { IAlert } from '../../interfaces';
import UIHintsFallback from './UIHintsFallback';
import UILoader from './UILoader';

const UIBar = (data: IAlert, loading: boolean): string => {
  const hasData = data && data.alerts;
  const controls: string = UIControls(!!hasData);
  const fallback = loading ? UILoader() : UIHintsFallback();
  const cards = hasData ? UIHints(data.alerts) : fallback;
  return `${controls}${cards}`;
};

export default UIBar;
