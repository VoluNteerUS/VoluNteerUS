import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResult } from 'src/types/pagination';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10,
    ): Promise<PaginationResult<User>> {
        return this.userService.findAll(page, limit);
    }

    @Get()
    findOneByEmail(email: string): Promise<User> {
        return this.userService.findOneByEmail(email);
    }

    @Get("/search")
    findUsers(@Query('query') query: string): Promise<User[]> {
        // If query is empty, return all users
        if (!query) {
            // Return empty array
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        } else {
            return this.userService.findUsers(query);
        }
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
