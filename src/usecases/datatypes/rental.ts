import { Decimal } from "@prisma/client/runtime";

export interface Rental {
  id?: number;
  candidateId?: number;
  bikeId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  rate: number;
  serviceFee: Decimal;
}
