export class CreateNotificationDto {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}
