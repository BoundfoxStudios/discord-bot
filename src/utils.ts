import { debugLog } from './deps.ts';

export interface DebugInstance {
  (message: string, ...args: string[]): void;
}

export const deriveDebug = (name: string): DebugInstance => {
  return debugLog.default(`BFS:${name}`);
};
