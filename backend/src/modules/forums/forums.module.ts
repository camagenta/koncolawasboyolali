import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module.js';
import { ThreadsModule } from './threads/threads.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { LikesModule } from './likes/likes.module.js';

@Module({
  imports: [CategoriesModule, ThreadsModule, CommentsModule, LikesModule],
  exports: [CategoriesModule, ThreadsModule, CommentsModule, LikesModule],
})
export class ForumsModule {}
