import {Injectable, Injector} from '@angular/core';
import {NgxLoggerLevel} from './types/logger-level.enum';
import {LoggerConfig} from './logger.config';
import {NGX_LOGGER_LISTENER} from './logger.interface';
import {NGXLoggerConfigEngine} from './config.engine';


@Injectable()
export class NGXLogger {
  private configService: NGXLoggerConfigEngine;

  constructor(private loggerConfig: LoggerConfig,
              private injector: Injector) {
    // each instance of the logger should have their own config engine
    this.configService = new NGXLoggerConfigEngine(loggerConfig);
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
    this.configService.updateConfig(config);
  }

  public getConfig(): LoggerConfig {
    return this.configService.getConfig();
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = []): void {
    if (!message) {
      return;
    }

    this.injector.get(NGX_LOGGER_LISTENER, [])
      .forEach(logger => logger.log(level, message, additional));
  }
}
