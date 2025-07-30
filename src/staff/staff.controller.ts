import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  async findAll() {
    return await this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.staffService.findOne(id);
  }

  @Get('staff/:id')
  findByAccount(@Param('id') id: string) {
    return this.staffService.findByAccount(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    try {
      const res = await this.staffService.update(id, updateStaffDto);
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
