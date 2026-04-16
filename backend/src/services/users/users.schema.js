// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
<<<<<<< HEAD
import { passwordHash } from '@feathersjs/authentication-local'
=======
import bcrypt from 'bcryptjs'
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const userSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    username: Type.String(),
    email: Type.String(),
<<<<<<< HEAD
    password: Type.Optional(Type.String()),
    
=======
    password: Type.Optional(Type.String())
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
  },
  { $id: 'User', additionalProperties: false }
)
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  password: async () => undefined
})

<<<<<<< HEAD


=======
// Helper: hash password with minimum rounds (>=12) from env
const hashPassword = async (plain) => {
  if (!plain) return plain
  const rounds = Math.max(12, parseInt(process.env.BCRYPT_ROUNDS || '12', 10))
  return bcrypt.hash(plain, rounds)
}
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['email', 'password', 'username'], {
  $id: 'UserData'
})
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
<<<<<<< HEAD
  password: passwordHash({ strategy: 'local' })
})




=======
  password: async (value) => {
    return await hashPassword(value)
  }
})

>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({
<<<<<<< HEAD
  password: passwordHash({ strategy: 'local' })
})





=======
  password: async (value) => {
    // Only hash if a password is provided in the patch
    if (typeof value === 'undefined' || value === null) return value
    return await hashPassword(value)
  }
})

>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['_id', 'email', 'password'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  _id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user._id
    }

    return value
  }
<<<<<<< HEAD
})
=======
})
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
