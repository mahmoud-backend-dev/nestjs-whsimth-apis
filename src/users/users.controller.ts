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
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './schema/users.schema';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Query as expressQuery } from 'express-serve-static-core';
import { DeleteUserParamIdDto } from './dto/delete-user.dto';
import {
  BanUserBodyDto,
  BanUserForeverParamIdDto,
  BanUserParamIdDto,
} from './dto/ban-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body()
    changePasswordDto: ChangePasswordDto,
    @CurrentUser()
    user: User,
  ): Promise<object> {
    return await this.usersService.changePassword(changePasswordDto, user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage user', 'manage roles')
  async getAllUsers(
    @Query()
    query: expressQuery,
    @Query('user')
    userQuery: string,
  ): Promise<object> {
    return this.usersService.getAllUsers(query, userQuery);
  }

  @Get('all/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  async getAllAdminsUser(
    @Query()
    query: expressQuery,
    @Query('user')
    userQuery: string,
  ): Promise<object> {
    return await this.usersService.getAllAdminsUser(query, userQuery);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage user')
  async deleteUser(
    @Param()
    params: DeleteUserParamIdDto,
  ): Promise<object> {
    return await this.usersService.deleteUser(params.id);
  }

  @Post('add/ban/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage user')
  async banUser(
    @Param()
    params: BanUserParamIdDto,
    @Body()
    banUserBodyDto: BanUserBodyDto,
    @CurrentUser()
    user: User,
  ): Promise<object> {
    return await this.usersService.banUser(params.id, banUserBodyDto, user);
  }

  @Post('add/ban-forever/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage user')
  async banForeverUser(
    @Param()
    params: BanUserForeverParamIdDto,
    @CurrentUser()
    user: User,
  ): Promise<object> {
    return await this.usersService.banForeverUser(params.id, user);
  }

  @Delete('remove/ban/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage user')
  async removeBanUser(
    @Param()
    params: BanUserParamIdDto,
    @CurrentUser()
    user: User,
  ): Promise<object> {
    return await this.usersService.unBanUser(params.id, user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User): Promise<object> {
    return await this.usersService.aboutMe(user._id);
  }

  @Post('add/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage roles')
  async addRole(
    @Body()
    addRoleDto:AddRoleDto
  ):Promise<object>{
    return await this.usersService.addRole(addRoleDto);
  }

  @Delete('remove/role/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage roles')
  async removeRole(
    @Param()
    removeRoleDto:RemoveRoleDto, 
  ):Promise<object>{
    return await this.usersService.removeRole(removeRoleDto.id);
  }
}
