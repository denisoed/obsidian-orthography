import UIControls from './UIControls';
import UIHints from './UIHints';
import { IAlert } from '../../interfaces';
import UIHintsFallback from './UIHintsFallback';
import UILoader from './UILoader';
import UIDictionary from './UIDictionary';

const UIBar = (
  data: IAlert,
  loading: boolean,
  showDictionary: boolean = false,
  dictionary: string[] = []
): string => {
  const hasData = data && data.alerts && data.alerts.length;
  const controls: string = UIControls(!!hasData);
  const fallback = loading ? UILoader() : UIHintsFallback();
  const cards = showDictionary
    ? UIDictionary(dictionary)
    : hasData
    ? UIHints(data.alerts)
    : fallback;
  return `${controls}${cards}`;
};

export default UIBar;
