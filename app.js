const yargs = require("yargs");
const axios = require("axios");

const argv = yargs
    .options({
        address: {
            describe: 'Address to fetch weather for',
            demand: true,
            alias: 'a',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

//console.log(argv);

var encodedAddress = encodeURIComponent(argv.address);
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

// axios support promises but request doesn't 
// in axios then((response)) then uses "response.data" for result like "body" is used in request
axios.get(geocodeURL).then((response) => {
    if(response.data.status === "ZERO_RESULTS") {
        throw new Error("Unable to find that address.");
    }

    var latitude = response.data.results[0].geometry.location.lat;
    var longitude = response.data.results[0].geometry.location.lng;
    var weatherURL = `https://api.darksky.net/forecast/43717681acf2765e19b3ab44e0acfdc5/${latitude},${longitude}`;

    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherURL)
    // console.log(response.data);    
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`Its currently ${temperature}. It feels like ${apparentTemperature}`);
}).catch((e) => {
    // console.log(e);
    if(e.code === "ENOTFOUND") {
        console.log("Unable to connect to API server.")
    } else {
        console.log(e.message);
    }
    
});
