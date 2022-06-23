import Storage from '../helpers/storage'
import AuthService from '@core/services/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { unixTime } from '../utils/datetime'
import { isEmpty } from '../utils/object'
import { uuid } from '../utils/hash'
import http from './http'
import { extension } from '../utils/url'

const keyPrefix = 's3-'
const ERROR_MISS_CONFIG = 'Miss config'
const ERROR_TOKEN_EXPIRED = 'Token expired'
const ERROR_BUCKET_INVALID = 'Bucket is invalid'
const UNIX_TIME_ONE_MUUTE = 60 * 1000

const BUCKETS = {
  static: process.env.VUE_APP_BUCKET_STATIC,
}

const S3Service = {
  clients: {},
  config(key) {
    return Storage.get(`${keyPrefix}${key}`, {})
  },
  // Update this is re load client and save token local
  update(key, config) {
    Storage.set(`${keyPrefix}${key}`, config)
    S3Service.clients[key] = S3Service.create(key)
  },
  destroy() {
    S3Service.clients = {}
    for (const key in BUCKETS) {
      Storage.remove(`${keyPrefix}${key}`)
    }
  },
  client(key) {
    const config = S3Service.config(key)
    if (!config || isEmpty(config)) {
      return { error: ERROR_MISS_CONFIG }
    }

    if (
      config.access_key_id === '' ||
      config.secret_access_key === '' ||
      config.session_token === '' ||
      config.expiration === ''
    ) {
      return { error: ERROR_MISS_CONFIG }
    }

    let time = new Date().getTime()
    if (unixTime(config.expiration) - time < 3 * UNIX_TIME_ONE_MUUTE) {
      return { error: ERROR_TOKEN_EXPIRED }
    }

    if (!S3Service.clients[key]) {
      S3Service.clients[key] = S3Service.create(key)
    }

    return { error: '', client: S3Service.clients[key] }
  },
  create(key) {
    const config = S3Service.config(key)
    return new S3Client({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: config.access_key_id,
        secretAccessKey: config.secret_access_key,
        sessionToken: config.session_token,
        expiration: config.expiration,
      },
    })
  },
  async upload(key, file) {
    let { client, error } = S3Service.client(key)
    if (error === ERROR_TOKEN_EXPIRED || error === ERROR_MISS_CONFIG) {
      const result = await S3Service.reloadToken(key)
      if (!result || !result.success) {
        return { ...result, success: false }
      }

      client = S3Service.clients[key]
    } else if (error != '') {
      return { success: false, message: error }
    }

    if (!BUCKETS[key]) {
      return { success: false, message: ERROR_BUCKET_INVALID }
    }
    const ext = extension(file.name)
    const path = `${AuthService.getId()}/${uuid()}.${ext}`
    try {
      await client.send(
        new PutObjectCommand({
          Key: path,
          Bucket: BUCKETS[key],
          Body: file,
        })
      )
      return { success: true, url: path }
    } catch (error) {
      return { success: false, message: error.toString() }
    }
  },

  async reloadToken(key) {
    const res = await http.get('/auth/amazon-access-token?type=' + key, {
      base_path: 'v1/shipment',
    })
    if (!res || res.error || !res.credentials) {
      return { success: false, message: res.errorMessage || ERROR_MISS_CONFIG }
    }

    S3Service.update(key, {
      access_key_id: res.credentials.access_key_id,
      secret_access_key: res.credentials.secret_access_key,
      session_token: res.credentials.session_token,
      expiration: res.credentials.expiration,
      arn: res.federated_user.arn,
      federated_user_id: res.federated_user.federated_user_id,
      packed_policy_size: res.packed_policy_size,
    })

    return Object.assign({ success: true }, res)
  },
}

export default S3Service
