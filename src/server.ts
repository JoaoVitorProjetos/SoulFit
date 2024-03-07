import express, { urlencoded } from 'express'
const app = express()
require('dotenv').config();

import mongoose from 'mongoose'
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@authjwt.i4skxmu.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log('db connected...')
    })
    .catch((err) => console.log(err))


import route from './routes'

app.use(urlencoded());
app.use(route)

app.listen(3000, () => {
    console.log('Server on...')
})