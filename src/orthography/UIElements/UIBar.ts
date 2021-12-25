import UIControls from './UIControls';
import UIHints from './UIHints';
import { IAlert } from '../../interfaces';
import UIHintsFallback from './UIHintsFallback';
import UILoader from './UILoader';

const UIBar = (data: IAlert, loading: boolean): string => {
  const controls: string = UIControls();
  const fallback = loading ? UILoader() : UIHintsFallback();
  const cards = data && data.alerts ? UIHints(data.alerts) : fallback;
  return `${controls}${cards}`;
};

export default UIBar;
