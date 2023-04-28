export interface RentRequest {
  candidateId: number;
  bikeId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  bikeRate: number;
}
