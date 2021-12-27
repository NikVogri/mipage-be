import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from 'src/todo-item/todo-item.entity';
import { Todo } from 'src/todo/todo.entity';
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
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    return await this.todoItemRepository.createTodoItem(
      todo,
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
    updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return await this.todoItemRepository.updateTodoItem(
      todoItem,
      updateTodoItemDto,
    );
  }

  async deleteTodoItem(todoItem: TodoItem) {
    await this.todoItemRepository.remove(todoItem);
  }
}
