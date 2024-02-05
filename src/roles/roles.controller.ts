import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRoleOwnerDto } from './dto/add-role-owner.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  UpdateRoleBodyDto,
  UpdateRoleIdDto
} from './dto/update-role.dto';

@Controller({
  path: 'roles',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('add')
  @Roles('owner', 'admin', 'manage roles')
  async createRole(
    @Body()
    createRoleDto: CreateRoleDto,
  ): Promise<object> {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Patch('/update/:id')
  @Roles('owner', 'admin', 'manage roles')
  async updateRole(
    @Param()
    params: UpdateRoleIdDto,
    @Body()
    updateBodyDto:UpdateRoleBodyDto
  ): Promise<object> {
    return await this.rolesService.updateRole(params.id, updateBodyDto);
  }
    
  @Post('add/owner/:id')
  async createOwnerRole(
    @Param()
    params: CreateRoleOwnerDto,
  ): Promise<object> {
    return await this.rolesService.createRoleOwner(params.id);
  }
}
