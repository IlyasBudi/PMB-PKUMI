"use server"
import { UserNotification, sequelize } from "@/database/models"
import {
  ENUMERATION_SERVICE_UPDATE_STATUS_NOTIFICATION,
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_SUCCESS,
  RESPONSE_MESSAGE_NOT_FOUND,
  RESPONSE_MESSAGE_SUCCESS,
  WS_LOG_STATUS_DONE,
  WS_LOG_STATUS_FAILED,
} from "@/lib/constants"
import { sequelizeDataParser } from "@/lib/utils"
import { createWsLog, updateWsLog } from "@/lib/wsLog"

export const getNotification = async (username) => {
  try {
    return await UserNotification.findAll({
      attributes: ["id", "url", "title", "detail", "is_read"],
      where: { username },
      order: [["created_date", "DESC"]],
    }).then((data) => {
      data = sequelizeDataParser(data)
      return data.map((v) => ({ ...v, is_read: v.is_read === 1 }))
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateStatusNotification = async ({ notification_id, status }) => {
  try {
    const notif = await UserNotification.findByPk(notification_id)
    if (!notif) {
      throw {
        status: RESPONSE_CODE_NOT_FOUND,
        message: RESPONSE_MESSAGE_NOT_FOUND,
      }
    }

    // Update notification
    await notif.update({
      isRead: status,
      updatedDate: new Date(),
      updatedBy: sequelize.literal(`(SELECT id FROM users WHERE username = '${notif.username}')`),
    })

    return {
      status: RESPONSE_CODE_SUCCESS,
      message: RESPONSE_MESSAGE_SUCCESS,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const actionUpdateStatusNotif = async (value) => {
  let wsLog = null
  try {
    wsLog = await createWsLog(ENUMERATION_SERVICE_UPDATE_STATUS_NOTIFICATION, value)
    const response = await updateStatusNotification(value)
    await updateWsLog(wsLog, WS_LOG_STATUS_DONE, response)
    return [response]
  } catch (error) {
    if (wsLog) {
      await updateWsLog(wsLog, !error.name ? WS_LOG_STATUS_DONE : WS_LOG_STATUS_FAILED, error)
    }
    throw [error, true]
  }
}

export const getLatestNotification = async (username) => {
  if (!username) return null
  try {
    return await UserNotification.findOne({
      attributes: ["id", "url", "title", "detail", "is_read"],
      where: { username },
      order: [["created_date", "DESC"]],
      raw: true,
    }).then((data) => (data ? { ...data, is_read: Boolean(data.is_read) } : null))
  } catch (error) {
    console.error(error)
    throw error
  }
}
