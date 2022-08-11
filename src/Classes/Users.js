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
        this.totalSpent = this.bookings.reduce((acc, booking) => {
            let foundRoom = this.rooms.find(room => {
                return room.number === booking.roomNumber
            })
            acc += foundRoom.costPerNight
            return acc;
        }, 0).toFixed(2);
    }

    setFilteredBookings(bookings) {
        this.filteredBookings = bookings;
    }

    setFilteredRooms(rooms) {
        this.filteredRooms = rooms;
    }
    addFilteredRoom(room) {
        this.filteredRooms.push(room);
    }

    removeFilteredRoom(roomNumber) {
        this.filteredRooms = this.filteredRooms.filter(room => room.number !== roomNumber)
    }

}