import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenant') // Specify the table name
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenant_name: string;

  @Column()
  tenant_email: string;

  @Column()
  role: string;

  @Column()
  tenant_code: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column('text', { array: true, nullable: true })
  subscription_details: string[];

  @Column({ nullable: true })
  company_type: string;

  @Column({ nullable: true })
  isRegistered: boolean;

  @Column({ nullable: true })
  image: string; // Assuming image is stored as base64 string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

export default Tenant; // Export the Tenant entity
