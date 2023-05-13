import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get()
    findOneByEmail(email: string): Promise<User> {
        return this.userService.findOneByEmail(email);
    }
    
    @Patch()
    update(id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }
    
    @Delete()
    remove(id: string): Promise<User> {
        return this.userService.delete(id);
    }
}
