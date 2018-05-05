import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpMetaDataInterface} from './types/http-meta-data.interface';
import {NGXLoggerListenerInterface} from './logger.interface';
import {NGXLogger} from './logger.service';
import {NgxLoggerLevel} from './types/logger-level.enum';
import {NGXLoggerUtils} from './utils/logger.utils';
import {NGXConsoleLoggerService} from './console-logger.service';

@Injectable()
export class NGXLoggerHttpService implements NGXLoggerListenerInterface {
  constructor(private http: HttpClient,
              private consoleLogger: NGXConsoleLoggerService,
              private ngxLogger: NGXLogger) {

  }

  log(level: NgxLoggerLevel, message, additional: any[]): void {
    const config = this.ngxLogger.getConfig();
    if (!config.serverLoggingUrl || level < config.serverLogLevel) {
      return;
    }

    // only use validated parameters for HTTP requests
    const validatedAdditionalParameters = NGXLoggerUtils.prepareAdditionalParameters(additional);
    const timestamp = new Date().toISOString();
    const callerDetails = NGXLoggerUtils.getCallerDetails();
    const metaData: HttpMetaDataInterface = {
      level, timestamp,
      fileName: callerDetails.fileName,
      lineNumber: callerDetails.lineNumber,
    };

    // make sure the stack gets sent to the server
    message = NGXLoggerUtils.prepareMessage(message);
    message = message instanceof Error ? message.stack : message;

    // Allow logging on server even if client log level is off
    this.logOnServer(config.serverLoggingUrl, message, validatedAdditionalParameters, metaData)
      .subscribe((res: any) => {
          // I don't think we should do anything on success
        },
        (error: HttpErrorResponse) => {
          this.consoleLogger.log(NgxLoggerLevel.ERROR, `FAILED TO LOG ON SERVER: ${message}`, [error]);
        }
      );
  }

  private logOnServer(url: string, message: string, additional: any[], metaData: HttpMetaDataInterface): Observable<any> {
    const body = {
      message, additional,
      level: metaData.level,
      timestamp: metaData.timestamp,
      fileName: metaData.fileName,
      lineNumber: metaData.lineNumber
    };

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(url, body, options);
  }
}
