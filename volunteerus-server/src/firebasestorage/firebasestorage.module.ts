import { Module } from '@nestjs/common';
import { FirebasestorageService } from './firebasestorage.service';

@Module({
    providers: [FirebasestorageService],
    exports: [FirebasestorageService],
})
export class FirebasestorageModule {}
