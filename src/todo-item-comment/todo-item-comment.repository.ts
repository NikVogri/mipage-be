import { TodoItem } from 'src/todo-item/todo-item.entity';
import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoItemCommentDto } from './dto/create-todo-item-comment.dto';
import { TodoItemComment } from './todo-item-comment.entity';

@EntityRepository(TodoItemComment)
export class TodoItemCommentRepository extends Repository<TodoItemComment> {
  async createComment(
    todoItem: TodoItem,
    author: User,
    createTodoItemComment: CreateTodoItemCommentDto,
  ) {
    const { body } = createTodoItemComment;

    const comment = this.create({
      todoItem,
      author,
      body,
    });

    await this.save(comment);
    return comment;
  }

  async findItemsWithPagination(
    todoItem: TodoItem,
    page: number,
    pageSize: number,
  ) {
    return this.find({
      where: {
        id: todoItem.id,
      },
      relations: ['author'],
      take: pageSize,
      skip: page * pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
