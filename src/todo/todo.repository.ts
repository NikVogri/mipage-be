import { NotFoundException } from '@nestjs/common';
import { Page } from 'src/page/page.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createTodo(page: Page, createTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, color } = createTodoDto;
    const todo = this.create({ title, color, page });

    await this.save(todo);

    delete todo.page;
    return todo;
  }

  async updateSingleTodo(
    todo: Todo,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const updated = { ...todo, ...updateTodoDto };
    await this.save(updated);

    return updated;
  }

  async getSingleTodo(todoId: string): Promise<Todo> {
    const todo = await this.findOne(todoId);

    if (!todo) {
      throw new NotFoundException(`Todo with id ${todoId} not found`);
    }

    return todo;
  }

  async getAllPageTodosWithItems(page: Page): Promise<Todo[]> {
    return this.find({ where: { page }, relations: ['items'] });
  }
}
