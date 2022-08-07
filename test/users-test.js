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
    let room1;
    let bookingModels = [];
    let roomModels = [];
    let user1;
    let user2;

    beforeEach(() => {
        user1 = new User(customers[0])
        user2 = new User(customers[1])
        booking1 = new Booking(bookings[0]);
        booking2 = new Booking(bookings[1]);
        room1 = new Room(rooms[0])

    })

    it('Should be a function', () => {
        expect(User).to.be.a('function');
    });

    it('Should be an instance of User', () => {
        console.log(user1.id)
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
            console.log({ currentUserRooms });
            user.setRooms(currentUserRooms);
        }
        setCurrentUserBookings(user1);
        setCurrentUserRooms(user1);
        user1.setTotalSpent()
        expect(user1.totalSpent).to.equal('5743.85');
    })
})