import { Decimal } from "@prisma/client/runtime";

export interface Rent {
  id?: number;
  candidateId?: number;
  bikeId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  rate: number;
  serviceFee: Decimal;
}
