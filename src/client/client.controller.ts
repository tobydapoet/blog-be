import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clientService.findOne(id);
  }

  @Get('account/:id')
  findByAccount(@Param('id') id: string) {
    return this.clientService.findByAccount(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    try {
      const res = await this.clientService.update(id, updateClientDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
