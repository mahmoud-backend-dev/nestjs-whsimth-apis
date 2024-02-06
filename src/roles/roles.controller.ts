import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRoleOwnerDto } from './dto/add-role-owner.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateRoleBodyDto, UpdateRoleIdDto } from './dto/update-role.dto';
import { Query as queryExpress } from 'express-serve-static-core';

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
    updateBodyDto: UpdateRoleBodyDto,
  ): Promise<object> {
    return await this.rolesService.updateRole(params.id, updateBodyDto);
  }

  @Delete('/remove/:id')
  @Roles('owner', 'admin', 'manage roles')
  async removeRole(
    @Param()
    params: UpdateRoleIdDto,
  ): Promise<object> {
    return await this.rolesService.removeRole(params.id);
  }

  @Post('add/admin/:id')
  @Roles('owner', 'admin')
  async createAdminRole(
    @Param()
    params: CreateRoleOwnerDto,
  ): Promise<object> {
    return await this.rolesService.createRoleAdmin(params.id);
  }

  @Delete('remove/admin/:id')
  @Roles('owner', 'admin')
  async removeAdminRole(
    @Param()
    params: CreateRoleOwnerDto,
  ): Promise<object> {
    return await this.rolesService.removeAdminRole(params.id);
  }

  @Post('add/owner/:id')
  @Roles('owner')
  async createOwnerRole(
    @Param()
    params: CreateRoleOwnerDto,
  ): Promise<object> {
    return await this.rolesService.createRoleOwner(params.id);
  }

  @Delete('remove/owner/:id')
  @Roles('owner')
  async removeOwnerRole(
    @Param()
    params: CreateRoleOwnerDto,
  ): Promise<object> {
    return await this.rolesService.removeOwnerRole(params.id);
  }

  @Get('all')
  @Roles('owner', 'admin', 'manage roles')
  async getAllRoles(
    @Query()
    query: queryExpress,
  ): Promise<object> {
    return await this.rolesService.getAllRoles(query);
  }
}
