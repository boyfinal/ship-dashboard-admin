import * as yup from 'yup'

const valider = {
  errors: {},
  shape: null,

  schema(cb) {
    valider.shape = yup.object().shape(cb(yup))
    return valider
  },

  async check(form) {
    if (valider.shape == null) return true

    const errors = await valider.shape
      .validate(form, { abortEarly: false })
      .then(() => [])
      .catch((err) => {
        if (err.name !== 'ValidationError') throw err

        return err.inner || []
      })

    valider.errors = {}
    for (const err of errors) {
      valider.errors[err.path] = err.message
    }

    return errors.length == 0
  },

  hasError(key) {
    if (!valider.errors) return false
    return !!valider.errors[key]
  },

  error(key) {
    if (!valider.errors) return ''
    return valider.errors[key] || ''
  },
}

export default valider
