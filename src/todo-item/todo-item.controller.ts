import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { PageRolesGuard } from 'src/page/guards/page-roles.guard';
import { GetTodo } from 'src/todo/get-todo.decorator';
import { TodoItem } from 'src/todo-item/todo-item.entity';
import { Todo } from 'src/todo/todo.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { GetTodoItem } from './get-todo-item.decorator';
import { TodoItemService } from './todo-item.service';
import { Roles } from 'src/page/roles.decorator';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { parseTodoItemForOutput } from './serializers/todo-item.serializer';
import { Page } from 'src/page/page.entity';
import { GetPage } from 'src/page/get-page.decorator';

@Controller('/pages/:pageId/todos/:todoId/todo-items')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async createTodoItem(
    @GetUser() user: User,
    @GetTodo() todo: Todo,
    @Body()
    createTodoItemDto: CreateTodoItemDto,
  ) {
    const todoItem = await this.todoItemService.createTodoItem(
      todo,
      user,
      createTodoItemDto,
    );

    return parseTodoItemForOutput(todoItem);
  }

  @Get('/:todoItemId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getTodoItem(@GetTodoItem() todoItem: TodoItem) {
    return parseTodoItemForOutput(todoItem);
  }

  @Get('/:todoItemId/public')
  async getPublicTodoItem(
    @GetPage() page: Page,
    @GetTodoItem() todoItem: TodoItem,
  ) {
    if (page.private) {
      throw new ForbiddenException();
    }

    return parseTodoItemForOutput(todoItem);
  }

  @Patch('/:todoItemId/complete')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async toggleCompleteTodoItem(
    @GetTodoItem() todoItem: TodoItem,
    @GetUser() user: User,
    @GetPage() page: Page,
  ) {
    const responseTodoItem = await this.todoItemService.toggleCompleteTodoItem(
      todoItem,
      user,
      page,
    );

    return parseTodoItemForOutput(responseTodoItem);
  }

  @Patch('/:todoItemId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updateTodoItem(
    @GetTodoItem() todoItem: TodoItem,
    @GetUser() user: User,
    @GetPage() page: Page,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    const responseTodoItem =
      await this.todoItemService.updateTodoItemBasicInformation(
        todoItem,
        user,
        page,
        updateTodoItemDto,
      );

    return parseTodoItemForOutput(responseTodoItem);
  }

  @Delete('/:todoItemId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async deleteTodoItem(
    @GetTodoItem() todoItem: TodoItem,
    @GetUser() user: User,
    @GetPage() page: Page,
  ) {
    return await this.todoItemService.deleteTodoItem(todoItem, user, page);
  }
}
