import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResult } from 'src/types/pagination';
import { Organization } from 'src/organizations/schemas/organization.schema';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get("/committeeMemberCount")
    getCommitteeMemberCount(): Promise<number> {
        return this.userService.getCommitteeMemberCount();
    }

    @Get()
    findAll(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10,
        @Query('search') search: string = '',
        @Query('role') role: string = 'All',
        @Query('sortBy') sortBy: string = 'Name'
    ): Promise<PaginationResult<User>> {
        const parsedPage = parseInt(page.toString(), 10) || 1;
        const parsedLimit = parseInt(limit.toString(), 10) || 10;
        // Validate If parsedPage and parsedLimit is negative
        if (parsedPage < 0 || parsedLimit < 0) {
          throw new HttpException('Page and Limit must be positive', HttpStatus.BAD_REQUEST, {
            cause: new Error('Page and Limit must be positive'),
          });
        }
        return this.userService.findAll(parsedPage, parsedLimit, search, role, sortBy);
    }

    @Get("count")
    count(): Promise<number> {
        return this.userService.count();
    }

    @Get("search")
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

    @Get(":id")
    findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<User> {
        return this.userService.findOne(id);
    }

    @Get()
    findOneByEmail(email: string): Promise<User> {
        return this.userService.findOneByEmail(email);
    }

    @Get(":id/organizations")
    findUserOrganizations(@Param('id') id: string): Promise<Organization[]> {
        return this.userService.findUserOrganizations(id);
    }
    
    @Patch()
    update(id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }
    
    @Delete(":id")
    remove(@Param('id') id: mongoose.Types.ObjectId): Promise<User> {
        return this.userService.delete(id);
    }
}