import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { UsersModule } from 'src/users/users.module';
import { AppController } from 'src/app.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PostsModule } from 'src/posts/posts.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { CategoriesModule } from './categories/categories.module';
import { StudentsModule } from './students/students.module';

@Module({
    imports: [
        UsersModule,
        PostsModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        CategoriesModule,
        StudentsModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
