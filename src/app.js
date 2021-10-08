const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars and its views directory name
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    // name 'index' must match with index.hbs in the views folder
    res.render('index', {
        title: 'Weather App',
        name: 'Steve',
    })
    // title and name can be passed into index.hbs
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Steve',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Some helpful text',
        title: 'Help Page',
        name: 'Steve',
    })
})

app.get('/json', (req, res) => {
    res.send([
        {
            name: 'Steve',
            age: 26,
        },
        {
            name: 'Andrew',
            age: 27,
        }
    ])
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    // default parameter {latitude, longitude, location} = {} because response might be undefined
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error: error})
        }
        // default parameter {forecast, location} = {} because response might be undefined
        forecast(latitude, longitude, location, (error, {forecast, location} = {}) => {
            if (error) {
                return res.send({error: error})
            }
            res.send({
                forecast: forecast,
                location: location,
                address: req.query.address,
            })
        })
    })

    // res.send({
    //     address: req.query.address,
    //     forecast: 'Rain',
    //     location: 'Surabaya',
    // })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term',
        })
    }
    
    console.log(req.query)
    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Steve',
        errorMessage: 'Help article not found (Specific 404 Error)',
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Steve',
        errorMessage: 'Generic 404 error',
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})