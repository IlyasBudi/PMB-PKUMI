import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { getTokenData } from "@/lib/nextServers"
import { getNotification } from "@/services/notification"

export async function GET() {
  const userData = getTokenData()
  try {
    return NextResponse.json(
      {
        status: constants.RESPONSE_CODE_SUCCESS,
        message: constants.RESPONSE_MESSAGE_SUCCESS,
        data: {
          list: await getNotification(userData.username),
        },
      },
      { status: constants.RESPONSE_CODE_SUCCESS }
    )
  } catch (error) {
    return await errorHandler(error, NextResponse)
  }
}
