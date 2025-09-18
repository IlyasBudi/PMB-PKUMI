import { getTokenData } from "@/lib/nextServers"
import { getStatusPendaftaran } from "@/services/user"
import * as constants from "@/lib/constants"
import { NextResponse } from "next/server"
import { errorHandler } from "@/lib/api"

export async function GET() {
  const userData = getTokenData()
  try {
    // Get User Profile
    let response = {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
      data: await getStatusPendaftaran(userData.username),
    }

    return NextResponse.json(response, {
      status: constants.RESPONSE_CODE_SUCCESS,
    })
  } catch (error) {
    return await errorHandler(error, NextResponse)
  }
}
