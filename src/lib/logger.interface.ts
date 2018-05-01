import {NgxLoggerLevel} from './types/logger-level.enum';
import {InjectionToken} from '@angular/core';

export const NGX_LOGGER_TOKEN = new InjectionToken<NGXLoggerInterface[]>('NGX_LOGGER_TOKEN');

export interface NGXLoggerInterface {
  log(level: NgxLoggerLevel, message, additional: any[]): void;
}
