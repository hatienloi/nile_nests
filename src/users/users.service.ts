import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { pagination } from 'src/common/pagination';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async user(id: number) {
        return this.prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            include: {
                posts: true
            }
        });
    }

    async findUserByUsername(username: string) {
        return this.prisma.user.findFirst({
            where: {
                username: username
            }
        });
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        return pagination<Prisma.UserDelegate<any>>(
            this.prisma,
            this.prisma.user,
            {
                ...params,
                include: {
                    posts: true
                }
            },
            UserEntity
        );
    }

    async createUser(data: CreateUserDto) {
        data.password = await bcrypt.hash('root', await bcrypt.genSaltSync(10));
        const user = await this.prisma.user.create({
            data
        });
        return new UserEntity(user);
    }

    async updateUser(id: number, data: UpdateUserDto) {
        data.updatedAt = new Date();
        const user = await this.prisma.user.update({
            data: {
                ...data,
                updatedAt: new Date()
            },
            where: {
                id
            }
        });
        return new UserEntity(user);
    }

    async deleteUser(userIds: number[]) {
        return this.prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });
    }
}
