import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/notification/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Page } from 'src/page/page.entity';
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
    private notificationService: NotificationService,
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

  async getTodoItem(todoId: string): Promise<TodoItem> {
    const todoItem = await this.todoItemRepository.getTodoItem(todoId);

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

  async toggleCompleteTodoItem(
    todoItem: TodoItem,
    user: User,
    page: Page,
  ): Promise<TodoItem> {
    const data = {
      completed: !todoItem.completed,
    };

    if (data.completed === true) {
      data['completedAt'] = new Date();
    } else {
      data['completedAt'] = null;
    }

    if (!this.isTodoItemOwner(todoItem, user)) {
      this.notificationService.createNotification(todoItem.creator, {
        type: NotificationType.TODO_ITEM_UPDATED,
        title: `Your todo item has been updated`,
        body: `${user.username} has ${
          data.completed ? 'completed' : 'uncompleted'
        } your todo item`,
        additionalData: {
          todoItemId: todoItem.id,
          todoId: todoItem.todoId,
          page: page.id,
        },
      });
    }

    return await this.updateTodoItem(todoItem, data);
  }

  async deleteTodoItem(todoItem: TodoItem, user: User, page: Page) {
    await this.todoItemRepository.remove(todoItem);

    if (!this.isTodoItemOwner(todoItem, user)) {
      this.notificationService.createNotification(todoItem.creator, {
        type: NotificationType.TODO_ITEM_REMOVED,
        title: `Your todo item has been deleted`,
        body: `${user.username} has deleted your todo item`,
        additionalData: {
          title: todoItem.title,
          todoId: todoItem.todoId,
          page: page.id,
        },
      });
    }
  }

  async updateTodoItemBasicInformation(
    todoItem: TodoItem,
    user: User,
    page: Page,
    updateTodoItemDto: UpdateTodoItemDto,
  ) {
    const updated = await this.todoItemRepository.updateTodoItem(todoItem, {
      title: updateTodoItemDto.title ?? todoItem.title,
      description: updateTodoItemDto.description ?? todoItem.description,
    });

    if (!this.isTodoItemOwner(todoItem, user)) {
      this.notificationService.createNotification(todoItem.creator, {
        type: NotificationType.TODO_ITEM_UPDATED,
        title: `Your todo item has been updated`,
        body: `${user.username} has updated your todo item: ${todoItem.title}`,
        additionalData: {
          todoItemId: todoItem.id,
          todoId: todoItem.todoId,
          page: page.id,
        },
      });
    }

    return updated;
  }

  isTodoItemOwner(todoItem: TodoItem, user: User): boolean {
    return todoItem.creator.id === user.id;
  }
}
