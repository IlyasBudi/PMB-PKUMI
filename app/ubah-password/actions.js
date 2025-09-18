"use server"
import { ENUMERATION_SERVICE_UBAH_PASSWORD, WS_LOG_STATUS_DONE, WS_LOG_STATUS_FAILED } from "@/lib/constants"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import { ubahPassword } from "@/services/user"

export const actionUbahPassword = async (payload) => {
  let wsLog = null
  try {
    wsLog = await createWsLog(ENUMERATION_SERVICE_UBAH_PASSWORD, payload)
    const response = await ubahPassword(payload)
    await updateWsLog(wsLog, WS_LOG_STATUS_DONE, response)
    return response
  } catch (error) {
    console.log(error)
    if (wsLog) {
      await updateWsLog(wsLog, !error.name ? WS_LOG_STATUS_DONE : WS_LOG_STATUS_FAILED, error)
    }
    return {
      isError: true,
      status: !error.name ? error.status : RESPONSE_CODE_INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
}
