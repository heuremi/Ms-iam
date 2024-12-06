import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateUserMachineDto {
    @IsNotEmpty()
    idUser?: string;

    @IsNotEmpty()
    idMachine?: string;
}