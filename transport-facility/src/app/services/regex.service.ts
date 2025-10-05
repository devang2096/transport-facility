import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegexService {
  constructor() {}

  static readonly employeeId = /^emp\d{4}$/i;
  static readonly vehicleNo = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i;
  static readonly address = /^[a-zA-Z0-9\s,.'-]{3,100}$/;
  static readonly time = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
}
