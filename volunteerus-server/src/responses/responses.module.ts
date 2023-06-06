import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response, ResponseSchema } from './schemas/response.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }])],
    providers: [ResponsesService],
    exports: [ResponsesService],
    controllers: [ResponsesController],
  })
  export class ResponsesModule {}
  