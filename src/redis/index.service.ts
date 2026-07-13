import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisSerivce implements OnModuleInit, OnModuleDestroy {
    private client = createClient();

    async onModuleInit() {
        this.client.on('error', err => {
            console.log('Redis Client Error: ', err)
        });
        await this.client.connect();
        console.log('Redis connection established');
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    getClient() {
        return this.client;
    }

    async set(key: string, value: string) {
        return this.client.set(key, value);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async del(key: string) {
        return this.client.del(key);
    }
}
