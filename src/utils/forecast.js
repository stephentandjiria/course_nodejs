const request = require('request')

const forecast = (latitude, longitude, location, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=fa3b607bef581857cf81db2cc8ed62d2&query='+
    latitude + ',' + longitude

    // request({url, json: true}, (error, response) => {
    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location, error code: ' + body.error.code, undefined)
        } else {
            callback(undefined, {
                forecast: body.location.name + ' : ' +
                body.current.weather_descriptions[0] +
                    ' It is currently ' + body.current.temperature +
                    ' degrees, but feels like ' + body.current.feelslike + ' degrees.',
                location: location,
            })
        }
    })
}

module.exports = forecast