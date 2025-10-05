import { Injectable } from '@angular/core';
import { Ride } from '../models/ride.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RideService {
  private storageKey = 'transport_rides_v1';
  private rides: Ride[] = [];
  private ridesSubject = new BehaviorSubject<Ride[]>([]);
  public rides$ = this.ridesSubject.asObservable();

  constructor() {
    this.load();
    this.emitToday();
  }

  private get hasLocalStorage(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  }

  private load() {
    if (!this.hasLocalStorage) {
      this.rides = [];
      return;
    }
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.rides = JSON.parse(saved) as Ride[];
      } catch {
        this.rides = [];
      }
    } else {
      this.rides = [];
    }
  }

  private persist() {
    if (!this.hasLocalStorage) return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.rides));
    } catch {
      // ignore
    }
  }

  private emitToday() {
    this.ridesSubject.next(this.listRidesForToday());
  }

  private todayISO(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  listRidesForToday(): Ride[] {
    const today = this.todayISO(new Date());
    return this.rides.filter(r => r.timeISO.slice(0, 10) === today);
  }

  addRide(ride: Omit<Ride, 'id' | 'bookedBy'>): Ride {
    const today = this.todayISO(new Date());

    // ensure employee hasn't already added a ride for today
    const exists = this.rides.find(r =>
      r.employeeId === ride.employeeId &&
      r.timeISO.slice(0, 10) === ride.timeISO.slice(0, 10)
    );
    if (exists) throw new Error('Employee already has a ride for today');

    // ensure vehicle is not already added for a ride today
    const vehicleExists = this.rides.find(
      r =>
        r.vehicleNo.toLowerCase() === ride.vehicleNo.toLowerCase() &&
        r.timeISO.slice(0, 10) === today
    );
    if (vehicleExists)
      throw new Error('This vehicle already has a ride scheduled for today');  

    const newRide: Ride = { ...ride, id: this.makeId(), bookedBy: [] };
    this.rides.push(newRide);
    this.persist();
    this.emitToday();
    return newRide;
  }

  findById(id: string): Ride | undefined {
    return this.rides.find(r => r.id === id);
  }

  bookRide(rideId: string, employeeId: string): Ride {
    const ride = this.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    if (ride.employeeId === employeeId) throw new Error('Creator cannot book their own ride');
    if (ride.bookedBy && ride.bookedBy.includes(employeeId)) throw new Error('Already booked this ride');
    if (ride.vacantSeats <= 0) throw new Error('No vacant seats left');

    ride.vacantSeats = ride.vacantSeats - 1;
    ride.bookedBy = ride.bookedBy || [];
    ride.bookedBy.push(employeeId);

    this.persist();
    this.emitToday();
    return ride;
  }

  /** Return today's rides whose time falls within now +/- bufferMinutes */
  timeMatchForToday(bufferMinutes = 60): Ride[] {
    const now = new Date();
    const min = new Date(now.getTime() - bufferMinutes * 60000);
    const max = new Date(now.getTime() + bufferMinutes * 60000);

    return this.listRidesForToday().filter(r => {
      const t = new Date(r.timeISO);
      return t >= min && t <= max;
    });
  }

  private makeId() {
    return Math.random().toString(36).slice(2, 9);
  }
}
