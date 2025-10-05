export type VehicleType = 'Bike' | 'Car';

export interface Ride {
  id: string;
  employeeId: string;
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  timeISO: string;       // ISO string for ride's date/time (today)
  pickupPoint: string;
  destination: string;
  bookedBy?: string[];   // employeeIds who booked
}