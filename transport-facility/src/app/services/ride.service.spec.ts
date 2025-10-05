import { TestBed } from '@angular/core/testing';

import { RideService } from './ride.service';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [RideService] });
    service = TestBed.inject(RideService);
    });
    
    
    it('should add and list a ride for today', () => {
    const now = new Date();
    const iso = now.toISOString();
    const r = service.addRide({ employeeId:'emp1', vehicleType:'Car', vehicleNo:'KA-01-1234', vacantSeats:2, timeISO: iso, pickupPoint:'A', destination:'B'});
    const list = service.listRidesForToday();
    expect(list.length).toBe(1);
    expect(list[0].employeeId).toBe('emp1');
    });
    
    
    it('should not allow booking own ride', () => {
    const now = new Date().toISOString();
    const r = service.addRide({ employeeId:'emp2', vehicleType:'Bike', vehicleNo:'XX-11', vacantSeats:1, timeISO: now, pickupPoint:'P', destination:'D'});
    expect(() => service.bookRide(r.id, 'emp2')).toThrow();
    });
});
