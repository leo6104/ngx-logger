import {Injectable, Injector} from '@angular/core';
import {NgxLoggerLevel} from './types/logger-level.enum';
import {LoggerConfig} from './logger.config';
import {NGX_LOGGER_TOKEN} from './logger.interface';


@Injectable()
export class NGXLogger {
  constructor(private injector: Injector) {
  }

  public trace(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.TRACE, message, additional);
  }

  public debug(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.DEBUG, message, additional);
  }

  public info(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.INFO, message, additional);
  }

  public log(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.LOG, message, additional);
  }

  public warn(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.WARN, message, additional);
  }

  public error(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.ERROR, message, additional);
  }

  public updateConfig(config: LoggerConfig) {
    this.injector.get(NGX_LOGGER_TOKEN, [])
      .forEach(logger => logger.updateConfig(config));
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = [], logOnServer: boolean = true): void {
    if (!message) {
      return;
    }

    this.injector.get(NGX_LOGGER_TOKEN, [])
      .forEach(logger => logger.log(level, message, additional));
  }
}
