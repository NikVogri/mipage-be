import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from 'src/todo-item/todo-item.entity';
import { Todo } from 'src/todo/todo.entity';
import { User } from 'src/user/user.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { TodoItemRepository } from './todo-item.repository';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItemRepository)
    private todoItemRepository: TodoItemRepository,
  ) {}

  async createTodoItem(
    todo: Todo,
    creator: User,
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    return await this.todoItemRepository.createTodoItem(
      todo,
      creator,
      createTodoItemDto,
    );
  }

  async getSingleTodoItem(todoId: string): Promise<TodoItem> {
    const todoItem = await this.todoItemRepository.getSingleTodoItem(todoId);

    if (!todoItem) {
      throw new NotFoundException(`Todo item with id ${todoId} does not exist`);
    }

    return todoItem;
  }

  async updateTodoItem(
    todoItem: TodoItem,
    updates: Partial<TodoItem>,
  ): Promise<TodoItem> {
    return await this.todoItemRepository.updateTodoItem(todoItem, updates);
  }

  async toggleCompleteTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    const data = {
      completed: !todoItem.completed,
    };

    if (data.completed === true) {
      data['completedAt'] = new Date();
    } else {
      data['completedAt'] = null;
    }

    return await this.updateTodoItem(todoItem, data);
  }

  async deleteTodoItem(todoItem: TodoItem) {
    await this.todoItemRepository.remove(todoItem);
  }

  async updateTodoItemBasicInformation(
    todoItem: TodoItem,
    updateTodoItemDto: UpdateTodoItemDto,
  ) {
    return await this.todoItemRepository.updateTodoItem(todoItem, {
      title: updateTodoItemDto.title ?? todoItem.title,
      description: updateTodoItemDto.description ?? todoItem.description,
    });
  }
}
