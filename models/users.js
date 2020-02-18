// schema maps to a collection
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: 'String',
    required: true,
    trim: true
  }
})

userSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified || !user.isNew) {
    next()
  } else {
    bcrypt.hash(user.password, stage.saltingRounds, function (err, hash) {
      if (err) {
        console.log(`Error hashing password for user: ${user.name}`)
        next(err)
      } else {
        user.password = hash
        next()
      }
    })
  }
})

module.exports = mongoose.model('User', userSchema)
