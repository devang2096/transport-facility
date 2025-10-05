import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-add-ride',
  standalone: false,
  templateUrl: './add-ride.html',
  styleUrl: './add-ride.scss'
})
export class AddRide {
  form!: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private rideService: RideService) {
    // Initialize the form inside constructor (after fb is injected)
    this.form = this.fb.group({
      employeeId: ['', [Validators.required]],
      vehicleType: ['Car', [Validators.required]],
      vehicleNo: ['', [Validators.required]],
      vacantSeats: [1, [Validators.required, Validators.min(1)]],
      time: ['', [Validators.required]],
      pickupPoint: ['', [Validators.required]],
      destination: ['', [Validators.required]]
    });
  }

  submit() {
    this.message = '';

    if (this.form.invalid) {
      this.message = 'Please fill all required fields correctly';
      return;
    }

    // Build ISO time for current day
    const timeVal = this.form.value.time as string; // expected HH:mm
    const [hh, mm] = timeVal.split(':').map(Number);
    const now = new Date();
    const rideDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
    const isoTime = rideDate.toISOString();

    try {
      this.rideService.addRide({
        employeeId: this.form.value.employeeId!.trim(),
        vehicleType: this.form.value.vehicleType!,
        vehicleNo: this.form.value.vehicleNo!.trim(),
        vacantSeats: Number(this.form.value.vacantSeats),
        timeISO: isoTime,
        pickupPoint: this.form.value.pickupPoint!.trim(),
        destination: this.form.value.destination!.trim()
      });
      this.message = 'Ride added successfully';
      this.form.reset({ vehicleType: 'Car', vacantSeats: 1 });
    } catch (e: any) {
      this.message = e?.message || 'Failed to add ride';
    }
  }
}
