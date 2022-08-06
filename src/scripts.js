import { fetchApiData } from './apiCalls'
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
const userPromise = fetchApiData('http://localhost:3001/api/v1/customers')
console.log(userPromise);
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'


