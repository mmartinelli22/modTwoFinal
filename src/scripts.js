import { fetchApiData } from './apiCalls';
import { Booking } from './Classes/Booking';
import { Room } from './Classes/Room';
import { User } from './Classes/Users';
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
let searchButton = document.querySelector('.search-submit');
let users = [];
let rooms = [];
let bookings = [];
let currentUser;
let roomTypeDropDown = document.querySelector('#roomTypeDropDown')
let searchRooms = document.querySelector('#searchRooms')
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
    greeting()
})
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/luxury.png'
const getUsersCost = () => {
    let roomCost = document.querySelector('.total-rooms-cost')
    console.log(currentUser)
    currentUser.setTotalSpent()
    roomCost.innerHTML = `Your current cost is $${currentUser.totalSpent}`
}
const showBookings = () => {
    let userBookings = document.querySelector('.bookings');
    userBookings.innerHTML = '<ol> Your current bookings are'
    currentUser.bookings.forEach(booking => {
        userBookings.innerHTML += `<li>${booking.date}: Room ${booking.roomNumber}</li>`;
    });
    userBookings.innerHTML += '</ol>'
}
const greeting = () => {
    let greeting = document.querySelector('.welcome-message');
    greeting.innerHTML = `Hello,${currentUser.name.split(" ")[0]}`
}
const showFilteredBookings = (event) => {
    event.preventDefault();
    let showBookings = document.querySelector('#birthday')
    let storedBookings = document.querySelector('#show-bookings')
    let newBookings = bookings.filter(booking => {
        const buildDateString = (date) => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const calendarDateValue = new Date(showBookings.value);
        const calendarDateString = buildDateString(calendarDateValue);
        const bookingDateValue = new Date(booking.date);
        const bookingDateString = buildDateString(bookingDateValue);
        return bookingDateString === calendarDateString
    })
    currentUser.filteredBookings = newBookings;
    if (newBookings === []) {
        storedBookings.innerText = 'Sorry, there are no rooms available on that day.'
        console.log(storedBookings.innerText)
    } else {
        console.log(newBookings)
        storedBookings.innerHTML = '<ol>';
        newBookings.forEach(booking => {
            storedBookings.innerHTML += `<li>${booking.date}: Room ${booking.roomNumber}</li>`;
        })
        storedBookings.innerHTML += '</ol>'
        show(roomTypeDropDown)
        show(searchRooms)
    }
}
function show(element) {
    element.classList.remove('hidden');
};
function hide(element) {
    element.classList.add('hidden')
}

const filterBookingsByRoom = (event) => {
    event.preventDefault();
    const currentRoom = roomTypeDropDown.value ?? '';
    const filteredRooms = rooms.filter(room => currentUser.filteredBookings
        .some(booking => booking.roomNumber === room.number))
        .filter(room => room.roomType === currentRoom);
    console.log({ filteredRooms });
    currentUser.setFilteredRooms(filteredRooms);
    console.log({ event })
}

searchRooms.addEventListener('click', filterBookingsByRoom);
searchButton.addEventListener('click', showFilteredBookings);