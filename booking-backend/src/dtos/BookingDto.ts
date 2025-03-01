import { UserDto } from "./UserDto";

export class BookingDto {
  id: number;
  checkInDate: Date;
  checkOutDate: Date;
  note: string;
  status: number;
  createdAt: Date;
  user: UserDto;

  constructor(booking: any) {
    this.id = booking.id;
    this.checkInDate = booking.checkInDate;
    this.checkOutDate = booking.checkOutDate;
    this.note = booking.note;
    this.status = booking.status;
    this.createdAt = booking.createdAt;
    this.user = new UserDto(booking.user);
  }
}
