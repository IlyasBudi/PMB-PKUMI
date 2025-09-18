import { ID } from "./message_lib_id"

const Joi = require("joi").extend(require("@joi/date"))

export const updateStatusNotificationSchema = Joi.object()
  .keys({
    notification_id: Joi.number().required().label("notification_id"),
    status: Joi.boolean().required().label("status"),
  })
  .messages(ID)
