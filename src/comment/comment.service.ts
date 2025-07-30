import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentTableType } from './types/commentTableType';
import { Post } from 'src/post/entities/post.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/types/notification';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    private notificationService: NotificationService,
  ) {}

  handleTarget = async (comment: Comment) => {
    let target: Post | Blog | Comment | null = null;
    if (comment.commentTableType === CommentTableType.POST) {
      target = await this.postRepo.findOne({
        where: { id: comment.commentTableId },
      });
    } else if (comment.commentTableType === CommentTableType.COMMENT) {
      target = await this.commentRepo.findOne({
        where: { id: comment.commentTableId },
      });
    } else if (comment.commentTableType === CommentTableType.BLOG) {
      target = await this.blogRepo.findOne({
        where: { id: comment.commentTableId },
      });
    }
    return target;
  };

  async findAll() {
    const comments = await this.commentRepo.find({
      where: { isDeleted: false },
    });

    const result: Array<Comment & { target: Post | Blog | Comment | null }> =
      [];
    for (const comment of comments) {
      const target = await this.handleTarget(comment);
      result.push({ ...comment, target });
    }
    return result;
  }

  async findOne(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException("Can't find this comment");
    }
    const target = await this.handleTarget(comment);
    return { comment, target };
  }

  async findByType(typeId: number, type: CommentTableType) {
    if (type === CommentTableType.BLOG) {
      return await this.blogRepo.find({ where: { id: typeId } });
    } else if (type === CommentTableType.COMMENT) {
      return await this.commentRepo.find({ where: { id: typeId } });
    } else if (type === CommentTableType.POST) {
      return await this.commentRepo.find({ where: { id: typeId } });
    } else {
      throw new Error("Don't find this type!");
    }
  }

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepo.create(createCommentDto);
    await this.commentRepo.save(comment);
    const createdComment = await this.findOne(comment.id);
    if (createdComment) {
      if (comment.commentTableType === CommentTableType.BLOG) {
        const blog = await this.blogRepo.findOne({
          where: { id: comment.commentTableId },
        });
        if (blog) {
          return await this.notificationService.create({
            clientId: blog?.client.id,
            message: `${comment.client.account.name} just comment on your blog!`,
            refId: blog.id,
            type: NotificationType.COMMENTBLOG,
          });
        }
      } else if (comment.commentTableType === CommentTableType.POST) {
        const post = await this.postRepo.findOne({
          where: { id: comment.commentTableId },
        });
        if (post) {
          return await this.notificationService.create({
            clientId: post?.client.id,
            message: `${comment.client.account.name} just comment on your post!`,
            refId: post.id,
            type: NotificationType.COMMENTPOST,
          });
        }
      } else {
        const commentRespone = await this.postRepo.findOne({
          where: { id: comment.commentTableId },
        });
        if (commentRespone) {
          return await this.notificationService.create({
            clientId: commentRespone?.client.id,
            message: `${comment.client.account.name} just reponse your comment!`,
            refId: comment.id,
            type: NotificationType.COMMENT,
          });
        }
      }
    }
    return createdComment;
  }

  async update(id: number, updateCommentDto: Partial<UpdateCommentDto>) {
    await this.blogRepo.update({ id }, updateCommentDto);
    return this.findOne(id);
  }
}
