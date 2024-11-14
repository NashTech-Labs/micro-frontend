import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'planName' })
  planName: string;

  @Column({ name: 'numberOfEmployees' })
  numberOfEmployees: number;

  @Column({ name: 'planDuration', type: 'float' })
  planDuration: number;

  @Column({ name: 'planDescription' })
  planDescription: string;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

export default Subscription;
