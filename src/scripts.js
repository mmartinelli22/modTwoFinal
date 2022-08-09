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
let bookingsInfo = document.querySelector('#show-bookings')
let hideGrid = document.querySelector('.grid')
let bookingGrid = document.querySelector('.booking-grid')
let ourRooms = document.querySelector('.filteredRooms')
let projectTitle = document.querySelector('#title')
let searchSubmit = document.querySelector('#booking-search')
let loginForm = document.querySelector('#login')
let welcomeMessage = document.querySelector('#welcomeMessage')
let logOut = document.querySelector('#logOut')
let calendar = document.querySelector('#birthday')
const setCurrentUserBookings = (user) => {
    const userBookings = bookings.filter(booking => booking.userID === user.id);
    user.setBookings(userBookings);
}

const setCurrentUserRooms = (user) => {
    const currentUserRooms = rooms.filter(room => user.bookings.some(booking => booking.roomNumber === room.number));
    console.log({ currentUserRooms });
    user.setRooms(currentUserRooms);
}
const buildAuthPage = (id = 3) => {
    currentUser = users.find(user => user.id === id);
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
    removeShownBookings();
})

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/luxury.png'
const getUsersCost = () => {
    let roomCost = document.querySelector('.total-rooms-cost')
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
const greeting = (user) => {
    let greeting = document.querySelector('.welcome-message');
    greeting.innerHTML = `Hello,${user.name.split(" ")[0]}`
}
const removeShownBookings = () => {
    hide(searchSubmit);
    hide(projectTitle);
    hide(logOut);
    hide(searchRooms)
    hide(roomTypeDropDown)
    calendar.style.display = "none";
    let roomCost = document.querySelector('.total-rooms-cost');
    roomCost.innerHTML = '';
    let greeting = document.querySelector('.welcome-message');
    greeting.innerHTML = ``;
    let userBookings = document.querySelector('.bookings');
    userBookings.innerHTML = '';
    show(loginForm)
    let showBookings = document.querySelector('#birthday')
    let storedBookings = document.querySelector('#show-bookings')
    showBookings.innerHTML = ``;
    storedBookings.innerHTML = ``;
    showRooms.innerHTML = ``;
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
    if (!currentUser.filteredBookings.length) {
        storedBookings.innerText = 'Sorry, there are no rooms available on that day.'
    } else {
        storedBookings.innerHTML = '<ol> <p1 id="bookingsMessage">Possible bookings</p1>';
        newBookings.forEach(booking => {
            storedBookings.innerHTML += `<li  id = "filteredRooms">${booking.date}: Room ${booking.roomNumber}</li>`;
        })
        storedBookings.innerHTML += '</ol>';

        show(searchRooms)
        show(roomTypeDropDown)
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
        let roomButton = document.querySelector(`#bookingsButton${availableRoom.number}`)
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
const giveDisplay = () => {
    calendar.style.display = "initial";
}
const checkCustomerCredentials = (event) => {
    event.preventDefault();
    let customerLogin;
    customerLogin = new FormData(event.target);
    if (checkCustomerIsValid(customerLogin.get('username')) && customerLogin.get('password') === 'overlook2021') {
        fetch(`http://localhost:3001/api/v1/customers/${checkCustomerIsValid(customerLogin.get('username'))}`)
            .then(response => response.json())
            .then(response => {
                let newCalendar = document.querySelector('#birthday')
                buildAuthPage(response.id);
                showBookings()
                greeting(new User(response));
                show(bookingsInfo, hideGrid, bookingGrid, ourRooms)
                getUsersCost();
                showBookings();
                giveDisplay(newCalendar)
                show(projectTitle);
                show(searchSubmit);
                show(bookingsInfo);
                show(welcomeMessage)
                hide(loginForm);
                show(logOut)


            })
            .catch(error => console.log('ERROR: ', error));
    } else {
        window.alert('Invalid Username, or Password');
        event.target.reset();
    }
}
const checkCustomerIsValid = (userName) => {
    let customer = userName.substring(0, 8);
    let customerId = userName.substring(8);
    if (customer === 'customer' && parseInt(customerId) < 51) {
        return customerId;
    } else {
        return false;
    };
}
searchRooms.addEventListener('click', filterBookingsByRoom);
searchButton.addEventListener('click', showFilteredBookings);
document.getElementById('login').addEventListener('submit', checkCustomerCredentials);
logOut.addEventListener('click', removeShownBookings)