import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'learner@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 's3cretpassword' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
