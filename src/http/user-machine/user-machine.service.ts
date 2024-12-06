import { Injectable } from '@nestjs/common';
import { CreateUserMachineDto } from './dto/create-user-machine.dto';
import { UpdateUserMachineDto } from './dto/update-user-machine.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserMachine } from 'src/schemas/user-machine.schema';
import { MongoError } from 'mongodb';
import { DeleteResult } from 'mongodb';
import { Machine } from 'src/schemas/machine.schema';
import { User } from 'src/schemas/user.schema';
import { MachineService } from '../machine/machine.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserMachineService {
  constructor(
    @InjectModel(UserMachine.name) private userMachineModel: Model<UserMachine>,
    private machineService: MachineService,
    private userService: UserService,
  ) {}

  async create(createUserMachineDto: CreateUserMachineDto) {
    const { idUser, idMachine } = createUserMachineDto;

    if (!idUser || !idMachine) {
      throw new Error('Se deben proporcionar tanto el idUser como el idMachine');
    }

    // Verificar si el usuario existe
    const userExists = await this.userService.findOne(idUser);
    if (!userExists) {
      throw new Error('El usuario especificado no existe.');
    }

    // Verificar si la máquina existe
    const machineExists = await this.machineService.findOne(idMachine);
    if (!machineExists) {
      throw new Error('La máquina especificada no existe.');
    }

    const userMachine = await this.userMachineModel.create(createUserMachineDto);

    const populatedUserMachine = await this.userMachineModel
      .findById(userMachine._id)
      .populate('idMachine') 
      .exec();

    return populatedUserMachine;
  }

  async findMachinesByUser(userId: string): Promise<any[]> {
    return this.userMachineModel
      .find({ idUser: userId })
      .populate('idMachine')
      .exec();
  }
  

  async findAll() {
    return await this.userMachineModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userMachineModel.findById(id).exec();
  }

  async update(id: string, updateUserMachineDto: UpdateUserMachineDto) {
    try {
      return await this.userMachineModel.updateOne({ _id: id }, updateUserMachineDto);
    } catch (error: any) {
      throw new Error(`Error al actualizar la asociación: ${error.message}`);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userMachineModel.deleteOne({ _id: id });
  }
}
