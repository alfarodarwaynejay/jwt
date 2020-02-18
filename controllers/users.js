const User = require('../models/users')

module.exports = {
  getAll: (req, res) => {
    let result = {}
    let status = 200

    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      User.find({}, (err, users) => {
        if (!err) {
          const payload = req.decoded
        // TODO: Log the payload here to verify that it's the same payload
        //  we used when we created the token
        // console.log('PAYLOAD', payload);
        if (payload && payload.user === 'admin') {
          User.find({}, (err, users) => {
            if (!err) {
              result.status = status
              result.error = err
              result.result = users
            } else {
              status = 500
              result.status = status
              result.error = err
            }
            res.status(status).send(result)
          })
        } else {
          status = 401;
          result.status = status;
          result.error = `Authentication error`;
          res.status(status).send(result);
        }
        } else {
          console.log('Error', err)
        }
      })
    })
  },
  add: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
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
          res.status(status).send(result)
        })
      } else {
        status = 500
        result.status = status
        result.error = err
        res.status(status).send(result)
      }
    })
  },
  login: (req, res) => {
    const { name, password } = req.body

    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {}
      let status = 200

      if (!err) {
        User.findOne({ name }, (err, user) => {
          if (!err && user) {
            // compare password
            bcrypt.compare(password, user.password)
              .then(match => {
                if (match) {
                  const payload = { user: user.name }
                  const options = { expiresIn: '2d', issuer: 'http://localhost:3000' }
                  const token = jwt.sign(payload, jwt_secret, options)

                  result.token = token
                  result.status = status
                  result.result = user
                } else {
                  status = 401
                  result.status = status
                  result.error = { message: 'Authentication Error' }
                }
                res.status(status).send(result)
              })
              .catch(err => {
                status = 500
                result.status = status
                result.error = err
                res.status(status).send(result)
              })
          } else {
            status = 404
            result.status = status
            result.error = err
            res.status(status).send(result)
          }
        })
      } else {
        status = 500
        result.status = status
        result.error = err
        res.status(status).send(result)
      }
    })
  }
}
