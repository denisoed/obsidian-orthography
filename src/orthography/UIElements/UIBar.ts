import UIControls from './UIControls';
import UIHints from './UIHints';
import { IAlert } from '../../interfaces';

const UIBar = (data: IAlert): string => {
  const controls: string = UIControls();
  const cards = data && data.alerts ? UIHints(data.alerts) : '';
  return `${controls}${cards}`;
};

export default UIBar;
