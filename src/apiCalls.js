export function fetchApiData(url) {
    return fetch(url)
        .then(data => data.json())
};