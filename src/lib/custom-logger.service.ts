import {Inject, Injectable, Injector, PLATFORM_ID} from '@angular/core';

import {LoggerConfig} from './logger.config';
import {NGXLoggerHttpService} from './http.service';
import {NGXLogger} from './logger.service';


/**
 * CustomNGXLoggerService is designed to allow users to get a new instance of a logger
 * @TODO rewrite CustomNGXLoggerService for eventListener logic
 */
@Injectable()
export class CustomNGXLoggerService {

  constructor(private readonly httpService: NGXLoggerHttpService,
              private injector: Injector,
              @Inject(PLATFORM_ID) private readonly platformId) {
  }

  create(config: LoggerConfig, httpService?: NGXLoggerHttpService): NGXLogger {
    // you can inject your own httpService or use the default,
    return new NGXLogger(this.injector);
  }
}


