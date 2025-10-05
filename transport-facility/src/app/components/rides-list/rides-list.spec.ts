import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RidesList } from './rides-list';
import { RideService } from '../../services/ride.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Ride } from '../../models/ride.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('RidesList Component', () => {
  let component: RidesList;
  let fixture: ComponentFixture<RidesList>;
  let mockRideService: jasmine.SpyObj<RideService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const dummyRides: Ride[] = [
    {
      id: '1',
      employeeId: 'emp001',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB1234',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickupPoint: 'Point A',
      destination: 'Point B',
      bookedBy: []
    }
  ];

  beforeEach(async () => {
    mockRideService = jasmine.createSpyObj<RideService>('RideService', [
      'timeMatchForToday',
      'bookRide',
      'rides$'
    ], {
      rides$: of(dummyRides)
    });

    mockRideService.timeMatchForToday.and.returnValue(dummyRides);
    mockRideService.bookRide.and.callFake((rideId: string, empId: string) => {
      return { ...dummyRides[0], vacantSeats: 1, bookedBy: [empId] };
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [RidesList],
      providers: [
        { provide: RideService, useValue: mockRideService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RidesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should apply filters and load rides on init', () => {
    expect(component.rides.length).toBeGreaterThan(0);
    expect(mockRideService.timeMatchForToday).toHaveBeenCalled();
  });

  it('should show error when booking without employee ID', () => {
    component.myEmployeeId = '';
    component.book('1');
    expect(component.message).toBe('Please enter your Employee ID to book');
  });

  it('should show error when employee ID is invalid', () => {
    component.myEmployeeId = 'invalid_id';
    component.book('1');
    expect(component.message).toBe('Please enter a valid Employee Id');
  });

  it('should book a ride successfully with valid employee ID', () => {
    component.myEmployeeId = 'emp9999';
    component.book('1');
    expect(component.message).toBe('Ride booked successfully');
    expect(component.rides[0].vacantSeats).toBeLessThanOrEqual(2);
  });

  it('should navigate back to home on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});