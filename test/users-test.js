import { expect } from 'chai';
import { Booking } from '../src/classes/Booking';
import { Room } from '../src/classes/Room';
import { bookings } from '../src/data/bookingData';
import { rooms } from '../src/data/roomData';
import { User } from '../src/Classes/Users'
import { customers } from '../src/data/customerData'

describe('User', () => {

    let booking1;
    let booking2;
    let booking3;
    let room1;
    let bookingModels = [];
    let roomModels = [];
    let user1;
    let user2;
    let room2;
    let room3;
    let room4;

    beforeEach(() => {
        user1 = new User(customers[0])
        user2 = new User(customers[1])
        booking1 = new Booking(bookings[0]);
        booking2 = new Booking(bookings[1]);
        booking3 = new Booking(bookings[2])
        room1 = new Room(rooms[0])
        room2 = new Room(rooms[1])
        room3 = new Room(rooms[2])
        room4 = new Room(rooms[3])


    })

    it('Should be a function', () => {
        expect(User).to.be.a('function');
    });

    it('Should be an instance of User', () => {
        expect(user1).to.be.an.instanceOf(User);

        expect(user2).to.be.an.instanceOf(User);
    });
    it('should be able to hold customers info', () => {
        expect(user1.name).to.equal(customers[0].name)
        expect(user1.id).to.equal(customers[0].id)
    });
    it('should be able to return bookings', () => {
        user1.setBookings([])
        user1.addBooking(booking1)
        expect(user1.bookings[0]).to.deep.equal(booking1)
    })
    it('should be able to get total spent for user', () => {
        const setCurrentUserBookings = (user) => {
            const userBookings = bookings.filter(booking => booking.userID === user.id);
            user.setBookings(userBookings);
        }
        const setCurrentUserRooms = (user) => {
            const currentUserRooms = rooms.filter(room => user.bookings.some(booking => booking.roomNumber === room.number));
            user.setRooms(currentUserRooms);
        }
        setCurrentUserBookings(user1);
        setCurrentUserRooms(user1);
        user1.setTotalSpent()
        expect(user1.totalSpent).to.equal('8806.73');
    })
    it('should be able to add a users booking', () => {
        user1.addBooking(booking1)
        expect(user1.bookings.length).to.equal(1)
    })
    it('should be able to remove a users booking', () => {
        user1.addBooking(booking1);
        user1.addBooking(booking2);
        user1.removeBooking(booking1);
        expect(user1.bookings[0]).to.deep.equal(booking2)
    })
    it('should be able to add a users rooms', () => {
        user1.addRoom(room1)
        expect(user1.rooms[0]).to.deep.equal(room1)
    })
    it('should be able to remove a users rooms', () => {
        user1.addRoom(room1)
        user1.removeRoom(room1)
        expect(user1.rooms.length).to.equal(0)
    })
    it('should set a users filtered rooms', () => {
        user1.setFilteredRooms(room1)
        expect(user1.filteredRooms).to.deep.equal(room1)
    })
    it('should set a users filtered bookings', () => {
        user1.setFilteredBookings(booking1)
        expect(user1.filteredBookings).to.deep.equal(booking1)
    })
    it('should not be able to remove a room it cant find', () => {
        user1.addRoom(room1)
        user1.addRoom(room2)
        user1.addRoom(room3)
        user1.removeRoom(room4)
        expect(user1.rooms.length).to.equal(3);
    })
    it('should not be able to remove a booking it cant find', () => {
        user1.addBooking(booking1)
        user1.addBooking(booking2)
        user1.removeBooking(booking3)
        expect(user1.bookings.length).to.equal(2)
    })
    it('should only add for roomcostPerNight on totalspent', () => {
        user1.addRoom(room1)
        user1.addRoom(room2)
        user1.addRoom(booking1)
        user1.setTotalSpent()
        expect(user1.totalSpent).to.equal('0.00')
    })
})