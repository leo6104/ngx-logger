import {NGXLoggerListenerInterface} from './logger.interface';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {NgxLoggerLevel} from './types/logger-level.enum';
import {NGXLoggerUtils} from './utils/logger.utils';
import {HttpMetaDataInterface} from './types/http-meta-data.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {NGXLoggerHttpService} from './http.service';
import {NGXLogger} from './logger.service';

export const Levels = [
  'TRACE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'OFF'
];

@Injectable()
export class NGXConsoleLoggerService implements NGXLoggerListenerInterface {
  private _isIE: boolean;

  constructor(private readonly httpService: NGXLoggerHttpService,
              private ngxLogger: NGXLogger,
              @Inject(PLATFORM_ID) private readonly platformId) {
    this._isIE = isPlatformBrowser(platformId) &&
      !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));
  }

  log(level: NgxLoggerLevel, message, additional: any[] = []): void {
    this._log(level, message, additional);
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = [], logOnServer: boolean = true): void {
    if (!message) {
      return;
    }

    const logLevelString = Levels[level];

    message = NGXLoggerUtils.prepareMessage(message);

    // only use validated parameters for HTTP requests
    const validatedAdditionalParameters = NGXLoggerUtils.prepareAdditionalParameters(additional);

    const timestamp = new Date().toISOString();
    const config = this.ngxLogger.getConfig();

    const callerDetails = NGXLoggerUtils.getCallerDetails();

    if (logOnServer && config.serverLoggingUrl && level >= config.serverLogLevel) {

      const metaData: HttpMetaDataInterface = {
        level: level,
        timestamp: timestamp,
        fileName: callerDetails.fileName,
        lineNumber: callerDetails.lineNumber,
      };

      // make sure the stack gets sent to the server
      message = message instanceof Error ? message.stack : message;

      // Allow logging on server even if client log level is off
      this.httpService.logOnServer(config.serverLoggingUrl, message, validatedAdditionalParameters, metaData)
        .subscribe((res: any) => {
            // I don't think we should do anything on success
          },
          (error: HttpErrorResponse) => {
            this._log(NgxLoggerLevel.ERROR, `FAILED TO LOG ON SERVER: ${message}`, [error], false);
          }
        );
    }


    // if no message or the log level is less than the environ
    if (level < config.level) {
      return;
    }

    const metaString = NGXLoggerUtils.prepareMetaString(timestamp, logLevelString, callerDetails.fileName, callerDetails.lineNumber);

    // Coloring doesn't work in IE
    if (this._isIE) {
      return this._logIE(level, metaString, message, additional);
    }

    const color = NGXLoggerUtils.getColor(level);

    console.log(`%c${metaString}`, `color:${color}`, message, ...(additional || []));
  }

  private _logIE(level: NgxLoggerLevel, metaString: string, message: string, additional: any[]): void {

    // make sure additional isn't null or undefined so that ...additional doesn't error
    additional = additional || [];

    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`${metaString} `, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
        console.error(`${metaString} `, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`${metaString} `, message, ...additional);
        break;
      default:
        console.log(`${metaString} `, message, ...additional);
    }
  }
}