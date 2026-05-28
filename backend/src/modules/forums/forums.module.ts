import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [CategoriesModule, ThreadsModule, CommentsModule, LikesModule],
  exports: [CategoriesModule, ThreadsModule, CommentsModule, LikesModule],
})
export class ForumsModule {}
