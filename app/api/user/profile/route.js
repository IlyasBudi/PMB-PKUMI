import { errorHandler } from "@/lib/api"
import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { getTokenData } from "@/lib/nextServers"
import { getProfileData, updateProfileData } from "@/services/user"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import { schemaValidation } from "@/lib/utils"
import { userProfileSchema } from "@/validation/user"

export async function PUT(request) {
  const payload = await request.json()
  const userData = getTokenData()
  let wsLog = null
  try {
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_UPDATE_PROFILE, payload)
    const { error, value } = schemaValidation(userProfileSchema, payload)
    if (error) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }
    }

    const response = await updateProfileData(value, userData.username)
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

export async function GET() {
  const userData = getTokenData()
  try {
    // Get User Profile
    let response = {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
      data: await getProfileData(userData.username),
    }

    return NextResponse.json(response, {
      status: constants.RESPONSE_CODE_SUCCESS,
    })
  } catch (error) {
    return await errorHandler(error, NextResponse)
  }
}
