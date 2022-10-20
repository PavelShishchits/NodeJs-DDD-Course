export default {
    user: {
      create: ['record'],
      read: ['id'],
      update: ['id', 'record'],
      delete: ['id'],
      find: ['mask'],
    },
    country: {
      create: ['record'],
      read: ['id'],
      update: ['id', 'record'],
      delete: ['id'],
    },
    city: {
      create: ['record'],
      read: ['id'],
      update: ['id', 'record'],
      delete: ['id'],
    }
  }