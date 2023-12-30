import { range } from "./range";
export const signalPresets: { [sigId: string]: range; } = { };

signalPresets["Custom"] = {lrv: -100, urv: 100};
signalPresets["Milliamps"] = {lrv: 0, urv: 20};
signalPresets["Voltage"] = {lrv: 0, urv: 10};
signalPresets["Pressure"] = {lrv: 0, urv: 100};
