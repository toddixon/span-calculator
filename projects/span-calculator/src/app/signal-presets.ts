import { range } from "./range";
export const signalPresets: { [sigId: string]: range; } = { };

signalPresets["Custom"] = {lrv: -100, urv: 100};
signalPresets["Milliamps"] = {lrv: 0, urv: 20};
signalPresets["Voltage"] = {lrv: 0, urv: 10};
signalPresets["Pressure"] = {lrv: 0, urv: 100};

export function getSignalShort(key: string): string {
  let str = '';
  switch(key) {
    case 'Custom':
      str = '';
      break;
    case 'Milliamps':
      str = 'mA';
      break;
    case 'Voltage':
      str = 'V';
      break;
    case 'Pressure':
      str = 'Psi';
      break;
    default:
      str = '';
      break;
  }
  return str;
}