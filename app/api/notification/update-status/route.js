import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { schemaValidation } from "@/lib/utils"
import { updateStatusNotificationSchema } from "@/validation/notification"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import { updateStatusNotification } from "@/services/notification"

export async function POST(request) {
  const payload = await request.json()

  let wsLog = null
  try {
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_UPDATE_STATUS_NOTIFICATION, payload)
    const { error, value } = schemaValidation(updateStatusNotificationSchema, payload)
    if (error) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }
    }

    const response = await updateStatusNotification(value)
    await updateWsLog(wsLog, constants.WS_LOG_STATUS_DONE, response)
    return NextResponse.json(response, {
      status: response.status,
    })
  } catch (error) {
    if (wsLog) {
      await updateWsLog(wsLog, !error.name ? constants.WS_LOG_STATUS_DONE : constants.WS_LOG_STATUS_FAILED, error)
    }
    return await errorHandler(error, NextResponse)
  }
}
