import {NgxLoggerLevel} from './types/logger-level.enum';
import {InjectionToken} from '@angular/core';
import {LoggerConfig} from './logger.config';

export const NGX_LOGGER_TOKEN = new InjectionToken<NGXLoggerInterface[]>('NGX_LOGGER_TOKEN');

export interface NGXLoggerInterface {
  updateConfig(config: LoggerConfig);

  log(level: NgxLoggerLevel, message, additional: any[]): void;
}
