export function fetchApiData(url) {
    return fetch(url)
        .then(data => data.json())
        .catch(error => console.log(error))
};
export let postBookings = (data) => {
    return fetch('http://localhost:3001/api/v1/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            window.alert('We appologize, but the server is currently down. We\'re working on the issue.')
            throw new Error('Server is currently down. Please try again later.');
        } else {
            return response.json();
        }
    })
        .catch(error => console.log('ERROR: ', error));

}