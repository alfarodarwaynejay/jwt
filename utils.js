module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    let result


    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1]
      const options = { expiresIn: '2d', issuer: 'http://localhost:3000' }

      try {
        // verify token
        result = jwt.verify(token, jwt_secret, options)
        req.decoded = result
        
        //pass the control
        next()
      } catch (err) {
        // throw an error
        throw new Error(err)
      }
    } else {
      result = {
        error: 'Authentication error. Token required',
        status: 401
      }
      res.status(401).send(result)
    }
  }
}