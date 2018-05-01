import {NgxLoggerLevel} from './types/logger-level.enum';
import {InjectionToken} from '@angular/core';

export const NGX_LOGGER_LISTENER = new InjectionToken<NGXLoggerListenerInterface[]>('NGX_LOGGER_LISTENER');

export interface NGXLoggerListenerInterface {
  log(level: NgxLoggerLevel, message, additional: any[]): void;
}
