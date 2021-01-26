import { ObjectID } from 'mongodb'

import INotificationsRepository from '@/notifications/repositories/INotificationsRepository'
import ICreateNotificationDTO from '@/notifications/dtos/ICreateNotificationDTO'
import Notification from '@/notifications/infra/typeorm/schemas/Notification'

export default class NotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = []

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification()

    Object.assign(notification, { id: new ObjectID(), content, recipient_id })

    this.notifications.push(notification)

    return notification
  }
}
