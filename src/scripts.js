import { fetchApiData } from './apiCalls';
import { Booking } from './Classes/Booking';
import { Room } from './Classes/Room';
import { User } from './Classes/Users';
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
let users = [];
let rooms = [];
let bookings = [];
let currentUser;
const setCurrentUserBookings = (user) => {
    const userBookings = bookings.filter(booking => booking.userID === user.id);
    user.setBookings(userBookings);
}

const setCurrentUserRooms = (user) => {
    const currentUserRooms = rooms.filter(room => user.bookings.some(booking => booking.roomNumber === room.number));
    console.log({ currentUserRooms });
    user.setRooms(currentUserRooms);
}
const functionToRemoveAfterLoginWorks = () => {
    currentUser = users.find(x => !!x);
    setCurrentUserBookings(currentUser);
    setCurrentUserRooms(currentUser);
    console.log({ currentUser });
}
const userPromise = fetchApiData('http://localhost:3001/api/v1/customers')
const theseRooms = fetchApiData('http://localhost:3001/api/v1/rooms')
const userBookings = fetchApiData('http://localhost:3001/api/v1/bookings')
Promise.all([
    userPromise,
    theseRooms,
    userBookings
]).then(([customerResponse, roomResponse, bookingsResponse]) => {
    customerResponse.customers.forEach(val => {
        const currentUser = new User(val);
        users.push(currentUser);
    });
    roomResponse.rooms.forEach(val => {
        const currentRoom = new Room(val);
        rooms.push(currentRoom);
    });
    bookingsResponse.bookings.forEach(val => {
        const currentBooking = new Booking(val);
        bookings.push(currentBooking);
    });
    functionToRemoveAfterLoginWorks();
    getUsersCost()
    showBookings()
})
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/luxury.png'
const getUsersCost = () => {
    let roomCost = document.querySelector('.total-rooms-cost')
    console.log(currentUser)
    currentUser.setTotalSpent()
    roomCost.innerHTML = `Your current cost is ${currentUser.totalSpent}`
}
const showBookings = () => {
    let userBookings = document.querySelector('.bookings');
    userBookings.innerHTML = '<ol>'
    currentUser.bookings.forEach(booking => {
        userBookings.innerHTML += `<li>${booking.date}: Room ${booking.roomNumber}</li>`;
    });
    userBookings.innerHTML += '</ol>'
}