import { TestBed } from '@angular/core/testing';
import { RideService } from './ride.service';
import { Ride } from '../models/ride.model';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideService);
    // Reset local storage mock
    (service as any).rides = [];
    (localStorage as any).setItem('rides', JSON.stringify([]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new ride', () => {
    const ride = {
      employeeId: 'emp1234',
      vehicleType: 'Car' as const,
      vehicleNo: 'KA01AB2341',
      vacantSeats: 3,
      timeISO: new Date().toISOString(),
      pickupPoint: 'Koramangala',
      destination: 'Whitefield'
    };
    const newRide = service.addRide(ride);
    expect(newRide.id).toBeTruthy();
    expect(newRide.vehicleType).toBe('Car');
    expect(service.listRidesForToday().length).toBe(1);
  });

  it('should not allow same employee to add two rides for today', () => {
    const ride = {
      employeeId: 'emp1234',
      vehicleType: 'Bike' as const,
      vehicleNo: 'KA01XY9876',
      vacantSeats: 1,
      timeISO: new Date().toISOString(),
      pickupPoint: 'HSR Layout',
      destination: 'BTM'
    };
    service.addRide(ride);
    expect(() => service.addRide(ride)).toThrowError('Employee already has a ride for today');
  });

  it('should not allow same vehicle to add two rides for today', () => {
    const ride1 = {
      employeeId: 'emp1001',
      vehicleType: 'Car' as const,
      vehicleNo: 'KA09PQ1234',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickupPoint: 'JP Nagar',
      destination: 'Indiranagar'
    };
    const ride2 = { ...ride1, employeeId: 'emp1002' };
    service.addRide(ride1);
    expect(() => service.addRide(ride2)).toThrowError('This vehicle already has a ride scheduled for today');
  });

  it('should book a ride successfully', () => {
    const ride = {
      employeeId: 'emp9999',
      vehicleType: 'Car' as const,
      vehicleNo: 'KA07LM2222',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickupPoint: 'Jayanagar',
      destination: 'Marathahalli'
    };
    const added = service.addRide(ride);
    const booked = service.bookRide(added.id, 'emp7777');
    expect(booked.vacantSeats).toBe(1);
    expect(booked.bookedBy?.includes('emp7777')).toBeTrue();
  });

  it('should not allow booking own ride', () => {
    const ride = {
      employeeId: 'emp5000',
      vehicleType: 'Bike' as const,
      vehicleNo: 'KA02ZZ2222',
      vacantSeats: 1,
      timeISO: new Date().toISOString(),
      pickupPoint: 'Banashankari',
      destination: 'Madiwala'
    };
    const added = service.addRide(ride);
    expect(() => service.bookRide(added.id, 'emp5000')).toThrowError('Creator cannot book their own ride');
  });

  it('should not allow booking a ride twice by same employee', () => {
    const ride = {
      employeeId: 'emp6000',
      vehicleType: 'Car' as const,
      vehicleNo: 'KA01CC0001',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickupPoint: 'Hebbal',
      destination: 'Domlur'
    };
    const added = service.addRide(ride);
    service.bookRide(added.id, 'emp7000');
    expect(() => service.bookRide(added.id, 'emp7000')).toThrowError('Already booked this ride');
  });
});
