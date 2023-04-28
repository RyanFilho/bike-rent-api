import { RentData } from "@/usecases/datatypes/rent-data";

export interface RentRepository {
  add(rent: RentData): void;
}
