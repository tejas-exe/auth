import { createClient } from 'redis';
import logger from './logger';

const client = createClient({
    username: 'default',
    password: 'OHhPssw2B2a0MPPIVFRxr2mL4PvXr1tA',
    socket: {
        host: 'redis-19314.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 19314
    }
});

client.on('error', err => console.error('Redis Client Error', err));

// Connect the client before export
export const redisConnection = async () => {
    try {
        await client.connect();
        logger.info(`Redis connected`);
        console.log('Redis connected');
    } catch (err: any) {
        logger.error('Failed to connect to Redis:', err.message);
        console.error('Failed to connect to Redis:', err);
    }
};

export default client;
