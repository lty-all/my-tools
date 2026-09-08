import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ExecuteToolDto {
  @ApiProperty({ description: '工具输入内容', example: '{"name":"test"}' })
  @IsString()
  @IsNotEmpty()
  input: string;
}
