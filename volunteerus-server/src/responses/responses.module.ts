import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response, ResponseSchema } from './schemas/response.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]), CaslModule],
    providers: [ResponsesService],
    exports: [ResponsesService],
    controllers: [ResponsesController],
  })
  export class ResponsesModule {}
  