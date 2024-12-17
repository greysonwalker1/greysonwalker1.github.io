const options = {
    // Required: API key
    key: 'UN0v0SoLtWOoMULzpJqKeqEt5gnbuW94', // REPLACE WITH YOUR KEY !!!

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: 50.4,
    lon: 14.3,
    zoom: 5,
};

// Initialize Windy API
windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI;
    // .map is instance of Leaflet map
    // This function will intentionally create errors every 0.1 seconds
function createUselessErrors() {
    setInterval(() => {
        try {
            // Trigger a non-existing function (undefined function)
            nonExistingFunction();
        } catch (e) {
            // Catch the error and do nothing with it
            console.error("error: " + e.message);
        }

        try {
            // Accessing an undefined variable
            let x = undefinedVar + 1;
        } catch (e) {
            // Catch the error and do nothing with it
            console.error("error: " + e.message);
        }

        try {
            // Attempting to parse an invalid JSON
            JSON.parse("{invalidJson}");
        } catch (e) {
            // Catch the error and do nothing with it
            console.error("error: " + e.message);
        }
    }, 100); // Errors every 100 milliseconds (0.1 seconds)
}

// Call the function to start generating errors
createUselessErrors();

});