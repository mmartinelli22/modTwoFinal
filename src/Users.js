// {"id":"5fwrgu4i7k55hl6sz","userID":9,"date":"2022/04/22","roomNumber":15}
export class User {
    constructor(userData) {
        this.id = userData.id;
        this.name = userData.name;
        this.userBooking = [];
        this.rooms = [];
        this.totalSpent = 0;
    }

    setBookings(bookings) {
        this.bookings = bookings;
    }

    addBooking(booking) {
        this.bookings.push(booking);
    }

    removeBooking(bookingToRemove) {
        this.bookings = this.bookings.filter(booking => booking.id !== bookingToRemove.id)
    }

    setRooms(rooms) {
        this.rooms = rooms;
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    removeRoom(roomToRemove) {
        this.rooms = this.rooms.filter(room => room.number !== roomToRemove.number)
    }

    setTotalSpent() {
        this.totalSpent = this.rooms.reduce((acc, room) => (acc + room.costPerNight), 0)
    }

}