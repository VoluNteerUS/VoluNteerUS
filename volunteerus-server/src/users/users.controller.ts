import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResult } from '../types/pagination';
import { Organization } from '../organizations/schemas/organization.schema';
import { Event } from '../events/schemas/event.schema';
import mongoose from 'mongoose';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private uploadService: FirebasestorageService
    ) { }

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

    @Get(":id/recommendedEvents")
    findUserRecommendedEvents(@Param('id') id: string): Promise<Event[]> {
        return this.userService.findUserRecommendedEvents(id);
    }

    @Get(":id/upcomingEvents")
    findUserUpcomingEvents(@Param('id') id: string) {
        return this.userService.findUserUpcomingEvents(id);
    }
    
    @Patch(":id")
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File): Promise<User> {
        if (file) {
            // Check if file is an image
            if (!file.mimetype.includes('image')) {
                throw new HttpException('File must be an image', HttpStatus.BAD_REQUEST, {
                cause: new Error('File must be an image'),
                });
            }
            // Check if file size is greater than 10MB
            if (file.size > 5 * 1024 * 1024) {
                throw new HttpException('File size must be less than 5MB', HttpStatus.BAD_REQUEST, {
                cause: new Error('File size must be less than 5MB'),
                });
            }
            const destination = `users/${id}`;
            const url = await this.uploadService.uploadFile(file, destination);
            updateUserDto.profile_picture = url;

            // Delete old profile picture
            // const user = await this.userService.findOne(id);
            // if (user.profile_picture) {
            //     let oldFile = user.profile_picture.split('/').pop();
            //     await this.uploadService.deleteFile(oldFile, destination);
            // }
        }
        // "["Sign Language", "Singing"]" -> ["Sign Language", "Singing"]
        if (updateUserDto.skills) {
            let skills = updateUserDto.skills.toString().replace(/"/g, '').replace('[', '').replace(']', '').split(',');
            if (skills.length > 0) {
                if (skills[0] == '') {
                    skills = [];
                }
            }
            updateUserDto.skills = skills;
        }
        return this.userService.update(id, updateUserDto);
    }
    
    @Delete(":id")
    remove(@Param('id') id: mongoose.Types.ObjectId): Promise<User> {
        return this.userService.delete(id);
    }
}