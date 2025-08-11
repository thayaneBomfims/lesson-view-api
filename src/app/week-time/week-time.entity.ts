import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum WeekDay {
    SEGUNDA = 'segunda',
    TERCA = 'terca',
    QUARTA = 'quarta',
    QUINTA = 'quinta',
    SEXTA = 'sexta',
}

@Entity()
export class WeekTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: WeekDay })
    weekDay: WeekDay;

    @Column({ type: 'time' })
    time: string; // Ex: "14:00"

    @Column({ default: true })
    available: boolean;
}
