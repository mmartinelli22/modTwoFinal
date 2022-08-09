// {"id":"5fwrgu4i7k55hl6sz","userID":9,"date":"2022/04/22","roomNumber":15}
export class User {
    constructor(userData) {
        this.id = userData.id;
        this.name = userData.name;
        this.bookings = [];
        this.rooms = [];
        this.totalSpent = 0;
        this.filteredBookings = [];
        this.filteredRooms = [];
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
        this.totalSpent = this.rooms.reduce((acc, room) => (acc + room.costPerNight), 0).toFixed(2)
    }

    getPastBookings(date) {
        return this.bookings.filter(booking => booking.date < date);
    }

    getUpcomingBookings(date) {
        return this.bookings.filter(booking => booking.date >= date)
    }

    setFilteredBookings(bookings) {
        this.filteredBookings = bookings;
    }

    setFilteredRooms(rooms) {
        this.filteredRooms = rooms;
    }

    removeFilteredRoom(roomNumber) {
        this.filteredRooms = this.filteredRooms.filter(room => room.number !== roomNumber)
    }

}