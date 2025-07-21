import { Module } from '@nestjs/common';
import { DonorModule } from './donor/donor.module';
import { UsersModule } from './users/users.module';
import { DonationsModule } from './donations/donations.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { CategoriesModule } from './categories/categories.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { TransactionsController } from './transactions/transactions.controller';
import { SalesDetailsModule } from './sales-details/sales-details.module';
import { SalesHeaderModule } from './sales-header/sales-header.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsService } from './transactions/transactions.service';

@Module({
  imports: [DonorModule, UsersModule, DonationsModule, BeneficiariesModule, CategoriesModule, DeliveriesModule, TransactionsModule, InventoryModule, ProductsModule, WarehouseModule, SalesHeaderModule, SalesDetailsModule],
  controllers: [],
  providers: []
})
export class ModulesModule {}
