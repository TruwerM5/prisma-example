import { Injectable } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { Interval } from '@nestjs/schedule';


@Injectable()
export class CartCleanupTask {
    constructor(
        private readonly cart: CartService
    ) {}

    @Interval(5 * 60 * 1000)
    async handle() {
        await this.cart.deleteExpiredCarts();
        const date = new Date();
        console.log(`${date.toLocaleTimeString()}`,' expired carts were removed');
    }
}
