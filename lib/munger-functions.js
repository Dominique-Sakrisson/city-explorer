function formatLocationResponse(someGeoData){
    return {
      formatted_query: someGeoData[0].display_name,
      latitude: someGeoData[0].lat,
      longitude: someGeoData[0].lon
    };
}

function mungeWeatherResponse(someWeatherData){
    const formattedResponse = someWeatherData.data.map(weatherItem => {
        return {
        forecast: weatherItem.weather.description,
        time: new Date(weatherItem.ts * 1000).toDateString(),
        };
    });
    const finalResponse = formattedResponse.slice(0, 7);
    return finalResponse;
}

module.exports = {
    formatLocationResponse,
    mungeWeatherResponse
}