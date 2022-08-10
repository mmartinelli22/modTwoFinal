import { Room } from "./Room";
export class Booking {
    constructor(bookingData) {
        this.id = bookingData.id;
        this.userID = bookingData.userID;
        this.date = bookingData.date;
        this.roomNumber = bookingData.roomNumber;
    }
    // getRoomDetailsFromBookings(roomsData) {
    //     let roomAndBookingMatch = roomsData.find(room => room.number === this.roomNumber);
    //     this.roomDetails = new Room(roomAndBookingMatch);
    // }
}