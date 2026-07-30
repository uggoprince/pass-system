import { Injectable, Logger } from '@nestjs/common';

export type NotificationChannel = 'push' | 'sms' | 'whatsapp';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  dispatch(event: string, channel: NotificationChannel) {
    this.logger.log(`event=${event} channel=${channel}`);

    switch (channel) {
      case 'push':
        this.sendInAppPush(event);
        break;
      case 'sms':
      case 'whatsapp':
        this.logger.log(
          `[stub] ${channel} not implemented for this exercise; would dispatch here`,
        );
        break;
    }
  }

  private sendInAppPush(event: string) {
    this.logger.log(`[in-app push] delivered notification for "${event}"`);
  }
}
