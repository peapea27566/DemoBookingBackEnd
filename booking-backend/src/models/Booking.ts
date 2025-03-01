import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "bookings" })
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "datetime" })
  checkInDate!: Date;

  @Column({ type: "datetime" })
  checkOutDate!: Date;

  @Column({ type: "text", nullable: true })
  note?: string;

  @Column({ type: "int", default: 0 }) // 0 = wait, 1 = check-in, 2 = check-out, 3 = reject 
  status!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}
