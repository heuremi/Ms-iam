import { Module } from '@nestjs/common';
import { UserMachineService } from './user-machine.service';
import { UserMachineController } from './user-machine.controller';
import { UserMachine, UserMachineSchema } from 'src/schemas/user-machine.schema';
import { MachineModule } from '../machine/machine.module'; 
import { UserModule } from '../user/user.module'; 
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserMachine.name, schema: UserMachineSchema }]),
    MachineModule,
    UserModule, 
  ],
  controllers: [UserMachineController],
  providers: [UserMachineService],
})
export class UserMachineModule {}