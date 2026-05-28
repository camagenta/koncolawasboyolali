import { Injectable, NestInterceptor, ExecutionContext, CallHandler, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from '../../modules/activity-log/activity-log.service.js';

export const ACTIVITY_LOG_KEY = 'activityLog';
export const ActivityLogAction = (action: string) => SetMetadata(ACTIVITY_LOG_KEY, action);

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly activityLogService: ActivityLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<string>(ACTIVITY_LOG_KEY, context.getHandler());
    if (!action) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return next.handle();

    const entityId = request.params?.id || undefined;
    let entityType: string | undefined;

    if (entityId) {
      if (action === 'forum_comment') entityType = 'forum_comment';
      else if (action === 'job_approve' || action === 'job_reject') entityType = 'job_posting';
      else if (action === 'role_change') entityType = 'user';
    }

    return next.handle().pipe(
      tap(() => {
        this.activityLogService.log(user.id, action, entityType, entityId).catch(() => {});
      }),
    );
  }
}
