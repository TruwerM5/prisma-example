import { Injectable } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';


@Injectable()
export class CartCleanupTask {
    constructor(
        private readonly cart: CartService
    ) {}

    @Interval(5 * 60 * 1000)
    async handle() {
        await this.cart.deleteExpiredCarts();
        console.log('expired carts were removed');
    }
}
