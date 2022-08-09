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
let showRooms = document.querySelector('#showRooms')
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
    roomCost.innerHTML = '';
    currentUser.setTotalSpent()
    roomCost.innerHTML = `Your current cost is $${currentUser.totalSpent}`
}
const showBookings = () => {
    let userBookings = document.querySelector('.bookings');
    userBookings.innerHTML = '';
    userBookings.innerHTML = `<h1>Your current bookings are</h1><ol>`
    currentUser.bookings.forEach(booking => {
        userBookings.innerHTML += `<li id ='currentBookings'>${booking.date}: Room ${booking.roomNumber}</li>`;
        userBookings.innerHTML += '</ol>'
    });
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
    console.log('>>>>>', newBookings);
    if (!currentUser.filteredBookings.length) {
        storedBookings.innerText = 'Sorry, there are no rooms available on that day.'
        console.log(storedBookings.innerText)
    } else {
        storedBookings.innerHTML = '<ol> <p1 id="bookingsMessage">Possible bookings</p1>';
        newBookings.forEach(booking => {
            storedBookings.innerHTML += `<li id = "filteredRooms">${booking.date}: Room ${booking.roomNumber}</li>`;
        })
        storedBookings.innerHTML += '</ol>';
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

const roomButtonHandler = (event) => {
    const idPrefix = 'bookingsButton';
    const roomNumber = parseInt(event.target.id.replace(idPrefix, ''), 10);
    currentUser.removeFilteredRoom(roomNumber);
    buildShowRooms(currentUser.filteredRooms);
    addBookingByRoomNumber(roomNumber);
    addRoomByRoomNumber(roomNumber);
}

const addRoomByRoomNumber = (roomNumber) => {
    const roomToAdd = rooms.find((room) => room.number === roomNumber);
    currentUser.addRoom(roomToAdd);
    getUsersCost();
}

const addBookingByRoomNumber = (roomNumber) => {
    const bookingToAdd = bookings.find((booking) => booking.roomNumber === roomNumber);
    currentUser.addBooking(bookingToAdd);
    showBookings();
}

const buildShowRooms = (roomsToBuild) => {
    showRooms.innerHTML = roomsToBuild.reduce((acc, availableRoom) => {
        return `${acc}
            <li id="${availableRoom.number}">Number of beds:${availableRoom.numBeds}
            Amount:${availableRoom.costPerNight},
            Type of Room:${availableRoom.roomType},
            Size of Beds:${availableRoom.bedSize},
            Does it have a bidet?:${availableRoom.bidet},
            Room Number:${availableRoom.number}
            </li><button id ="bookingsButton${availableRoom.number}">Add to bookings?</button>
        `
    }, '<ol>')
    showRooms.innerHTML + `</ol>`;
    roomsToBuild.forEach((availableRoom) => {
        const roomButton = document.querySelector(`#bookingsButton${availableRoom.number}`)
        roomButton.addEventListener('click', roomButtonHandler)
    })
}

const filterBookingsByRoom = (event) => {
    event.preventDefault();
    showRooms.innerHTML = '';
    const currentRoom = roomTypeDropDown.value ?? '';
    const filteredRooms = rooms.filter(room => currentUser.filteredBookings
        .some(booking => booking.roomNumber === room.number))
        .filter(room => room.roomType === currentRoom);
    currentUser.setFilteredRooms(filteredRooms);
    console.log({ filteredRooms });
    if (currentUser.filteredRooms.length > 0) {
        buildShowRooms(currentUser.filteredRooms);
    } else {
        showRooms.innerHTML = `Sorry, we don't have any rooms of that type that day.`
    }

}

searchRooms.addEventListener('click', filterBookingsByRoom);
searchButton.addEventListener('click', showFilteredBookings);