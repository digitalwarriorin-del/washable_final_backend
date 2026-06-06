import { Module }
from '@nestjs/common';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  Service,
  ServiceSchema,
} from '../../database/schemas/service.schema';

import {
  Vendor,
  VendorSchema,
} from '../../database/schemas/vendor.schema';

import {
  ServicesController,
} from './services.controller';

import {
  ServicesService,
} from './services.service';

@Module({

  imports: [

    MongooseModule.forFeature([

      {
        name: Service.name,
        schema:
          ServiceSchema,
      },

      {
        name: Vendor.name,
        schema:
          VendorSchema,
      },
    ]),
  ],

  controllers: [
    ServicesController,
  ],

  providers: [
    ServicesService,
  ],
})

export class ServicesModule {}