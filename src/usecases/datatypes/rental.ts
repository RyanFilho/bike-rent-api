export interface Rental {
  id?: number;
  candidateId?: number;
  bikeId: number;
  userId: number;
  startDate: number;
  endDate: number;
  rate: number;
  serviceFee: string;
}
