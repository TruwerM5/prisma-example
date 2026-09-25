import { CliModule } from './cli.module';
import { NestFactory } from '@nestjs/core';
import { CartService } from './cart/cart.service';
import 'dotenv/config';

async function bootstrap() {
    console.log('CLI START');
    const app = await NestFactory.createApplicationContext(CliModule);
    try {
        const command = process.argv[2];
    
        switch (command) {
          case 'cart:cleanup': {
            const cartService = app.get(CartService);
    
            await cartService.deleteExpiredCarts();
    
            console.log('Expired carts deleted');
            break;
          }
    
          default:
            console.log(`Unknown command: ${command}`);
        }
    } catch (error) {
    console.error(error);
    } finally {
        await app.close();
    }
}

bootstrap().catch((err) => {
    console.error(err);
});