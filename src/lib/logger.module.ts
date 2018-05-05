import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {NGXLogger} from './logger.service';
import {LoggerConfig} from './logger.config';
import {CustomNGXLoggerService} from './custom-logger.service';
import {NGXLoggerHttpService} from './logonserver-logger.service';
import {NGX_LOGGER_LISTENER} from './logger.interface';
import {NGXConsoleLoggerService} from './console-logger.service';

export * from './logger.service';

export * from './logger.config';

export * from './custom-logger.service';
export * from './logonserver-logger.service';
export * from './logger.interface';
export * from './utils/logger.utils';
export * from './types/logger-level.enum';
export * from './types/http-meta-data.interface';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    NGXLogger,
    NGXConsoleLoggerService,
    NGXLoggerHttpService,
    CustomNGXLoggerService
  ]
})
export class LoggerModule {
  static forRoot(config: LoggerConfig | null | undefined): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        {provide: LoggerConfig, useValue: config || {}},
        [{provide: NGX_LOGGER_LISTENER, useClass: NGXConsoleLoggerService, multi: true}],
        [{provide: NGX_LOGGER_LISTENER, useClass: NGXLoggerHttpService, multi: true}],
        NGXLogger,
        CustomNGXLoggerService
      ]
    };
  }
}
