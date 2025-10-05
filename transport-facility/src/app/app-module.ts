import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AddRide } from './components/add-ride/add-ride';
import { RidesList } from './components/rides-list/rides-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Home } from './components/home/home';

@NgModule({
  declarations: [
    App,
    AddRide,
    RidesList,
    Home
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
