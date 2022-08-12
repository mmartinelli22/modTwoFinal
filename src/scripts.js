import { fetchApiData } from './apiCalls';
import { Booking } from './Classes/Booking';
import { Room } from './Classes/Room';
import { User } from './Classes/Users';
import './css/styles.css';
import './images/luxury.png';
import { postBookings } from './apiCalls'
let searchButton = document.querySelector('.search-submit');
let postedRoomData;
let booking;
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
let ourRooms = document.querySelector('.filtered\Rooms')
let projectTitle = document.querySelector('#title')
let searchSubmit = document.querySelector('#booking-search')
let loginForm = document.querySelector('#login')
let logOut = document.querySelector('#logOut')
let calendar = document.querySelector('#birthday')
const setCurrentUserBookings = (user) => {
    const userBookings = bookings.filter(booking => booking.userID === user.id);
    user.setBookings(userBookings);
}

const setCurrentUserRooms = (user) => {
    const currentUserRooms = rooms.filter(room => user.bookings.some(booking => booking.roomNumber === room.number));
    user.setRooms(currentUserRooms);
}
const buildAuthPage = (id) => {
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
        const eachUser = new User(val);
        users.push(eachUser);
    });
    roomResponse.rooms.forEach(val => {
        const currentRoom = new Room(val);
        rooms.push(currentRoom);
    });
    bookingsResponse.bookings.forEach(val => {
        const currentBooking = new Booking(val);
        bookings.push(currentBooking);
    });
    removePageInfo();
})
const getUsersCost = () => {
    let roomCost = document.querySelector('.total-rooms-cost')
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
const removePageInfo = () => {
    let roomCost = document.querySelector('.total-rooms-cost')
    hide(searchSubmit);
    hide(roomCost)
    hide(projectTitle);
    hide(logOut);
    hide(searchRooms)
    hide(roomTypeDropDown)
    calendar.style.display = "none";
    let greeting = document.querySelector('.welcome-message');
    greeting.style.display = "none";
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
        const buildDateString = (date) => `${date.getUTCMonth() + 1}/${date.getUTCDate() + 1}/${date.getUTCFullYear()}`;
        const calendarDateValue = new Date(showBookings.value);
        const calendarDateString = buildDateString(calendarDateValue);
        const bookingDateValue = new Date(booking.date);
        const bookingDateString = buildDateString(bookingDateValue);
        return bookingDateString === calendarDateString
    })
    let filteredRooms = rooms.filter(room => !newBookings.some(newBooking => newBooking.roomNumber === room.number))
    currentUser.filteredBookings = newBookings;
    currentUser.setFilterUnbookedRooms(filteredRooms)

    if (!currentUser.filterUnbookedRooms.length) {
        storedBookings.innerText = 'Sorry, there are no rooms available on that day.'
    } else {
        storedBookings.innerHTML = '<ol> <p1 id="bookingsMessage">Possible bookings</p1>';
        filteredRooms.forEach(room => {
            storedBookings.innerHTML += `<li  id = "filteredRooms">Room ${room.number}</li>`;
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
    console.log(roomsToBuild)
    showRooms.innerHTML = roomsToBuild.reduce((acc, availableRoom) => {
        return `${acc}
            <li id="${availableRoom.number}">Number of beds:${availableRoom.numBeds}
            Amount:${availableRoom.costPerNight},
            Type of Room:${availableRoom.roomType},
            Size of Beds:${availableRoom.bedSize},
            Does it have a bidet?:${availableRoom.bidet},
            Room Number:${availableRoom.number}
            </li><input type='submit' value ='add-to-booking' name ='add-booking' class ='bookings-button' id="room-${availableRoom.number}" ></input>
                 `
    }, '<ol>')
    console.log(roomsToBuild)
    showRooms.innerHTML + `</ol>`;
    roomsToBuild.forEach(room => {
        const currentButton = document.querySelector(`#room-${room.number}`);
        console.log(currentButton)
        currentButton.addEventListener('click', bookAvailableRooms);

    })
    //foreach add eevent listener room.number
}

const filterBookingsByRoom = (event) => {
    event.preventDefault();
    showRooms.innerHTML = '';
    const currentRoom = roomTypeDropDown.value ?? '';
    console.log(currentUser.filterUnbookedRooms);
    const filteredRooms = currentUser.filterUnbookedRooms.filter(room => room.roomType === currentRoom)
    currentUser.setFilteredRooms(filteredRooms);
    if (currentUser.filteredRooms.length > 0) {
        buildShowRooms(currentUser.filteredRooms);
    } else {
        showRooms.innerHTML = `Sorry, we don't have any rooms of that type that day.`
    }

}
const giveDisplay = () => {
    calendar.style.display = "initial";
    let greeting = document.querySelector('.welcome-message');
    greeting.style.display = "initial"
}
const checkCustomerCredentials = (event) => {
    event.preventDefault();
    let customerLogin;
    customerLogin = new FormData(event.target);
    if (checkCustomerLogin(customerLogin.get('username')) && customerLogin.get('password') === 'overlook2021') {
        fetch(`http://localhost:3001/api/v1/customers/${checkCustomerLogin(customerLogin.get('username'))}`)
            .then(response => response.json())
            .then(response => {
                let newCalendar = document.querySelector('#birthday')
                let roomCost = document.querySelector('.total-rooms-cost')
                buildAuthPage(response.id);
                showBookings()
                greeting(new User(response));
                show(bookingsInfo, hideGrid, bookingGrid, ourRooms)
                giveDisplay(newCalendar)
                show(projectTitle);
                show(searchSubmit);
                show(bookingsInfo);
                hide(loginForm);
                show(logOut)
                getUsersCost();
                show(roomCost);
            })
            .catch(error => console.log('ERROR: ', error));
    } else {
        window.alert('Invalid Username, or Password');
        event.target.reset();
    }
}
const checkCustomerLogin = (userName) => {
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
logOut.addEventListener('click', removePageInfo)
// ourRooms.addEventListener('click', function (event) {
//     const idPrefix = 'bookingsButton';
//     const roomNumber = parseInt(event.target.id.replace(idPrefix, ''), 10);
//     currentUser.removeFilteredRoom(roomNumber);
//     buildShowRooms(currentUser.filteredRooms);
//     addBookingByRoomNumber(roomNumber);
//     addRoomByRoomNumber(roomNumber);
//     if (event.target.classList == 'bookings-button') {
//         return bookAvailableRooms(event)
//     }
// })
const bookAvailableRooms = (event) => {
    event.preventDefault()
    postedRoomData = new FormData(document.querySelector('.calendarForm'))
    const idPrefix = 'room-';
    const roomNumber = parseInt(event.target.id.replace(idPrefix, ''), 10);
    let newBookedRoom = {
        userID: currentUser.id,
        date: postedRoomData.get('birthday').split('-').join('/'),
        roomNumber
    }
    postBookings(newBookedRoom).then(response => {
        window.alert(`WOO HOO!!! You're room is booked for ${(response.newBooking.date)}!`);
        booking = new Booking(response.newBooking)
        fetchApiData('http://localhost:3001/api/v1/bookings').then(data => {
            bookings = [];
            data.bookings.forEach(val => {
                const currentBooking = new Booking(val);
                bookings.push(currentBooking);
            });
            currentUser.removeFilteredRoom(roomNumber);
            buildShowRooms(currentUser.filteredRooms);
            setCurrentUserBookings(currentUser);
            setCurrentUserRooms(currentUser);
            getUsersCost();
            showBookings();
        })
    })
}