import { ClassType } from "../class.entity";

export class ReadClassDto {
    id: number;
    service: string;
    type: ClassType;
    price: number;
}
