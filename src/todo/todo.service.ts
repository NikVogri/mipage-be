import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoRepository } from './todo.repository';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page, PageType } from 'src/page/page.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository) private todoRepository: TodoRepository,
  ) {}

  async getAllPageTodos(page: Page): Promise<Todo[]> {
    return this.todoRepository.getAllPageTodosWithItems(page);
  }

  async createTodo(page: Page, createTodoDto: CreateTodoDto): Promise<Todo> {
    if (page.type !== PageType.todo) {
      throw new BadRequestException(
        `Can not create todo block on page ${page.id} of type ${page.type}`,
      );
    }

    return this.todoRepository.createTodo(page, createTodoDto);
  }

  async deleteTodo(todo: Todo): Promise<void> {
    await this.todoRepository.delete(todo.id);
  }

  async updateTodo(todo: Todo, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return await this.todoRepository.updateSingleTodo(todo, updateTodoDto);
  }

  async getSingleTodo(todoId: string): Promise<Todo> {
    const todo = await this.todoRepository.getSingleTodo(todoId);

    if (!todo) {
      throw new NotFoundException(
        `Todo block with id ${todoId} does not exist`,
      );
    }

    return todo;
  }
}
