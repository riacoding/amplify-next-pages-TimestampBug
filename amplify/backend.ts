import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'

const backend = defineBackend({
  auth,
  data,
})

backend.data.apiId

backend.addOutput({
  custom: {
    apiId: backend.data.apiId,
    PostTable: backend.data.resources.tables['Post'].tableName,
  },
})
