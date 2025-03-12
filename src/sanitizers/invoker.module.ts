import { Module } from '@nestjs/common';
import { Invoker } from './invoker';

@Module({
  providers: [Invoker],
  exports: [Invoker],
})
export class InvokerModule {}
