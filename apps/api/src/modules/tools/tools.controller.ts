import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ToolsService } from './tools.service';
import { ExecuteToolDto } from './dto/execute-tool.dto';

@ApiTags('Tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @ApiOperation({ summary: '获取工具列表' })
  findAll() {
    return this.toolsService.findAll();
  }

  @Post('json/execute')
  @ApiOperation({ summary: 'JSON 格式化' })
  formatJson(@Body() dto: ExecuteToolDto) {
    return this.toolsService.formatJson(dto.input);
  }
}
