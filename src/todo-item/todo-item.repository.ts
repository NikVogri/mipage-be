import { EntityRepository, Repository } from 'typeorm';
import { TodoItem } from './todo-item.entity';
import { Todo } from '../todo/todo.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

@EntityRepository(TodoItem)
export class TodoItemRepository extends Repository<TodoItem> {
  async createTodoItem(todo: Todo, createTodoItemDto: CreateTodoItemDto) {
    const { title } = createTodoItemDto;

    const todoItem = this.create({
      todo,
      title,
    });

    await this.save(todoItem);
    delete todoItem.todo;
    return todoItem;
  }

  async getSingleTodoItem(todoItemId: string): Promise<TodoItem> {
    return await this.findOne(todoItemId);
  }

  async updateTodoItem(todo: TodoItem, updateTodoItemDto: UpdateTodoItemDto) {
    const updated = {
      ...todo,
      ...updateTodoItemDto,
    };

    if (updateTodoItemDto.completed) {
      updated.completedAt = new Date();
    }

    await this.save(updated);
    return updated;
  }
}
