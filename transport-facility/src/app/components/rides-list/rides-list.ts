import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-rides-list',
  standalone: false,
  templateUrl: './rides-list.html',
  styleUrl: './rides-list.scss'
})
export class RidesList {
  rides: Ride[] = [];
  vehicleFilter = '';
  bufferMinutes = 60;
  myEmployeeId = '';
  message = '';

  private sub: Subscription | null = null;

  constructor(private rideService: RideService) {}

  ngOnInit() {
    // subscribe to today's rides
    this.sub = this.rideService.rides$.subscribe(() => this.applyFilters());
    // initial load
    this.applyFilters();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  applyFilters() {
    // apply time-match first, then vehicle filter
    let list = this.rideService.timeMatchForToday(this.bufferMinutes);
    if (this.vehicleFilter) {
      list = list.filter(r => r.vehicleType === this.vehicleFilter);
    }
    // sort by time ascending
    list.sort((a,b) => new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime());
    this.rides = list;
  }

  onFilterChange() { this.applyFilters(); }

  book(rideId: string) {
    this.message = '';
    if (!this.myEmployeeId) { this.message = 'Please enter your Employee ID to book'; return; }
    try {
      this.rideService.bookRide(rideId, this.myEmployeeId.trim());
      this.message = 'Ride booked successfully';
      this.myEmployeeId = ''; // optional: clear after booking
      this.applyFilters();
    } catch (err: any) {
      this.message = err?.message || 'Failed to book';
    }
  }
}
