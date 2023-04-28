export interface RentData {
  id?: number,
  candidateId: number;
  bikeId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  serviceFee: number;
  totalCharge: number;
}