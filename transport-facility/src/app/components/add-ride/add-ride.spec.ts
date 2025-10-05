import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRide } from './add-ride';
import { ReactiveFormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';

describe('AddRide', () => {
  let component: AddRide;
  let fixture: ComponentFixture<AddRide>;
  let rideServiceSpy: jasmine.SpyObj<RideService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RideService', ['addRide']);

    await TestBed.configureTestingModule({
      declarations: [AddRide],
      imports: [ReactiveFormsModule],
      providers: [{ provide: RideService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRide);
    component = fixture.componentInstance;
    rideServiceSpy = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.form.reset(); // makes it invalid
    component.submit();
    expect(rideServiceSpy.addRide).not.toHaveBeenCalled();
  });

  it('should call rideService.addRide when form is valid', () => {
    const mockRide = {
      id: 'r1',
      employeeId: 'emp1234',
      vehicleType: 'Car' as const,
      vehicleNo: 'KA01AB2341',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickupPoint: 'HSR Layout',
      destination: 'Whitefield',
      bookedBy: []
    };

    component.form.setValue({
      employeeId: 'emp1234',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB2341',
      vacantSeats: 2,
      time: '09:00',
      pickupPoint: 'HSR Layout',
      destination: 'Whitefield'
    });

    rideServiceSpy.addRide.and.returnValue(mockRide);

    component.submit();

    expect(rideServiceSpy.addRide).toHaveBeenCalledWith(
      jasmine.objectContaining({
        employeeId: 'emp1234',
        vehicleType: 'Car',
        vehicleNo: 'KA01AB2341'
      })
    );
  });

  it('should throw error if service throws error', () => {
    component.form.setValue({
      employeeId: 'emp1234',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB2341',
      vacantSeats: 2,
      time: '09:00',
      pickupPoint: 'HSR Layout',
      destination: 'Whitefield'
    });

    rideServiceSpy.addRide.and.throwError('This vehicle already has a ride scheduled for today');

    expect(() => component.submit()).toThrowError('This vehicle already has a ride scheduled for today');
  });
});