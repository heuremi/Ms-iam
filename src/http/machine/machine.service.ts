import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Machine } from 'src/schemas/machine.schema';
import { mongoErrorHandler } from 'src/utils/mongo-error-handler';
import { MongoError } from 'mongodb';
import { DeleteResult } from 'mongodb';


@Injectable()
export class MachineService {
  constructor(@InjectModel(Machine.name) private machineModel: Model<Machine>) {}

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const { licencePlate } = createMachineDto;

    const existingMachine = await this.machineModel.findOne({ licencePlate });
    if (existingMachine) {
      throw new ConflictException('La patente ya está asociada a otra máquina.');
    }

    const newMachine = new this.machineModel(createMachineDto);
    return newMachine.save();
  }

  async findAll() {
    return await this.machineModel.find().populate('area').exec();
  }

  async findOne(id: string) {
    const machine = await this.machineModel.findById(id).populate('area').exec();
    if (!machine) {
      throw new NotFoundException('La máquina no fue encontrada.');
    }
    return machine;  
  }

  async update(id: string, updateMachineDto: UpdateMachineDto) {
    const machine = await this.machineModel.findById(id);
    if (!machine) {
      throw new NotFoundException('La máquina no fue encontrada.');
    }

    if (updateMachineDto.licencePlate && updateMachineDto.licencePlate !== machine.licencePlate) {
      const existingMachine = await this.machineModel.findOne({
        licencePlate: updateMachineDto.licencePlate,
      });
      if (existingMachine) {
        throw new ConflictException('La patente ya está asociada a otra máquina.');
      }
    }

    Object.assign(machine, updateMachineDto);
    return machine.save();
  }

  async remove(id: string):Promise<DeleteResult> {
    const result = await this.machineModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('La máquina no fue encontrada.');
    }
    return result;  
  }

  async findByLicencePlate(licencePlate: string): Promise<Machine | null> {
    return this.machineModel.findOne({ licencePlate }).exec();
  }  
}
