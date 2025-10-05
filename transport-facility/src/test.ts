import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// 👇 This line is essential
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
