import { expect } from 'chai';
import { Booking } from '../src/classes/Booking';
import { Room } from '../src/classes/Room';
import { bookings } from '../src/data/bookingData';
import { rooms } from '../src/data/roomData';

describe('Booking', () => {

    let booking1;
    let booking2;
    let room1;
    let bookingModels = [];
    let roomModels = [];

    before(() => {

        booking1 = new Booking(bookings[0]);
        booking2 = new Booking(bookings[1]);

        bookings.forEach(booking => {
            bookingModels.push(new Booking(booking))
        });

        rooms.forEach(room => {
            roomModels.push(new Room(room))
        });

        room1 = new Room(rooms[0])

    })

    it('Should be a function', () => {
        expect(Booking).to.be.a('function');
    });

    it('Should be an instance of Bookings', () => {
        expect(booking1).to.be.an.instanceOf(Booking);

        expect(booking2).to.be.an.instanceOf(Booking);
    });
})