import {
  Body,
  Controller,
  Delete,
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

@Controller('/pages/:pageId/todos/:todoId/todo-items')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async createTodoItem(
    @GetUser() creator: User,
    @GetTodo() todo: Todo,
    @Body()
    createTodoItemDto: CreateTodoItemDto,
  ) {
    return await this.todoItemService.createTodoItem(
      todo,
      creator,
      createTodoItemDto,
    );
  }

  @Get('/:todoItemId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getTodoItem(@GetTodoItem() todoItem: TodoItem) {
    return parseTodoItemForOutput(todoItem);
  }

  @Patch('/:todoItemId/complete')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async toggleCompleteTodoItem(@GetTodoItem() todoItem: TodoItem) {
    return await this.todoItemService.toggleCompleteTodoItem(todoItem);
  }

  @Patch('/:todoItemId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updateTodoItem(
    @GetTodoItem() todoItem: TodoItem,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    return await this.todoItemService.updateTodoItemBasicInformation(
      todoItem,
      updateTodoItemDto,
    );
  }

  @Delete('/:todoItemId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async deleteTodoItem(@GetTodoItem() todoItem: TodoItem) {
    return await this.todoItemService.deleteTodoItem(todoItem);
  }
}
