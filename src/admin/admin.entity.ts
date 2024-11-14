import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin') // Specify the table name
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column({ default: 'super admin' })
  role: string;

  @Column({ nullable: true })
  image: string; // Assuming image is stored as base64 string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
