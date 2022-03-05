import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { PageRolesGuard } from 'src/page/guards/page-roles.guard';
import { Roles } from 'src/page/roles.decorator';
import { GetTodoItem } from 'src/todo-item/get-todo-item.decorator';
import { TodoItem } from 'src/todo-item/todo-item.entity';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateTodoItemCommentDto } from './dto/create-todo-item-comment.dto';
import { parseCreateTodoItemCommentOutput } from './serializers/todo-item-comment.serializer';
import { TodoItemComment } from './todo-item-comment.entity';
import { TodoItemCommentService } from './todo-item-comment.service';

@Controller('/pages/:pageId/todo-items/:todoItemId/comments')
export class TodoItemCommentController {
  constructor(private todoItemCommentService: TodoItemCommentService) {}

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getTodoItemComments(
    @GetTodoItem() todoItem: TodoItem,
    @Query('page') page: string,
    @Query('size') batchSize: string,
  ) {
    const res = await this.todoItemCommentService.getTodoItemComments(
      todoItem,
      page,
      batchSize,
    );

    const totalComments = await this.todoItemCommentService.getTotalComments(
      todoItem,
    );

    return {
      total: totalComments,
      comments: res.map((c: TodoItemComment) =>
        parseCreateTodoItemCommentOutput(c),
      ),
    };
  }

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async addComment(
    @GetTodoItem() todoItem: TodoItem,
    @GetUser() user: User,
    @Body() createCommentDto: CreateTodoItemCommentDto,
  ) {
    const res = await this.todoItemCommentService.addComment(
      todoItem,
      user,
      createCommentDto,
    );

    return parseCreateTodoItemCommentOutput(res);
  }
}
