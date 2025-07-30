import { createClient } from 'redis';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      // url: process.env.REDIS_URL,
      url: 'redis://localhost:6379',
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await client.connect();

    console.log('Redis connected');
    return client;
  },
};
