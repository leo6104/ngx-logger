import {NgxLoggerLevel} from './types/logger-level.enum';
import {InjectionToken} from '@angular/core';

export const NGX_LOGGER_LISTENER = new InjectionToken<NGXLoggerInterface[]>('NGX_LOGGER_LISTENER');

export interface NGXLoggerInterface {
  log(level: NgxLoggerLevel, message, additional: any[]): void;
}
