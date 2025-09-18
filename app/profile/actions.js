"use server"
import { ENUMERATION_SERVICE_UPDATE_PROFILE, WS_LOG_STATUS_DONE, WS_LOG_STATUS_FAILED } from "@/lib/constants"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import { updateProfileData } from "@/services/user"

export const actionUpdateProfile = async (value, username) => {
  let wsLog = null
  try {
    wsLog = await createWsLog(ENUMERATION_SERVICE_UPDATE_PROFILE, value)
    const response = await updateProfileData(value, username)
    await updateWsLog(wsLog, WS_LOG_STATUS_DONE, response)
    return [response]
  } catch (error) {
    if (wsLog) {
      await updateWsLog(wsLog, !error.name ? WS_LOG_STATUS_DONE : WS_LOG_STATUS_FAILED, error)
    }
    throw [error, true]
  }
}
