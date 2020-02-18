const User = require('../models/users')

module.exports = {
  add: (req, res) => {
    mongoose.connect(connUri, { useNewUrlOarser: true }, (err) => {
      let result = {}
      let status = 201

      if (!err) {
        const { name, password } = req.body
        const user = new User({ name, password })
        user.save((err, user) => {
          if (!err) {
            result.status = status
            result.result = user
          } else {
            status = 500
            result.status = status
            result.error = err
          }
          res.status(status).send(user)
        })
      } else {
        status = 500
        result.status = status
        result.error = err
        res.status(status).send(result)
      }
    })
    return
  }
}
