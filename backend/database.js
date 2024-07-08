const mongoose = require('mongoose')

const URI = '{mongoDB-COnnectUri}'


mongoose.connect(URI)

    .then(() => console.log('DB Working'))

    .catch(() => console.log(err))