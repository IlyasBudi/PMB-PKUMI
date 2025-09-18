import { errorHandler } from "@/lib/api"
import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { getTokenData } from "@/lib/nextServers"
import { pengajuanPendaftaran } from "@/services/user"
import { createWsLog, updateWsLog } from "@/lib/wsLog"

export async function GET() {
  const userData = getTokenData()
  let wsLog = null
  try {
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_PENGAJUAN_PENDAFTARAN, { username: userData.username })
    const response = await pengajuanPendaftaran(userData.username)
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
