export interface Rent {
  candidateId?: number;
  bikeId?: number;
  userId?: number;
  startDate: Date;
  endDate: Date;
  bikeRate: number;
  serviceFee: number;
  totalCharge: number;
}
