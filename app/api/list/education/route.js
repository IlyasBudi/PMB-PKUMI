import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { getListEducation } from "@/services/list"

export async function GET() {
  try {
    // Get data education
    let response = {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
      data: {
        list: await getListEducation(),
      },
    }

    return NextResponse.json(response, {
      status: constants.RESPONSE_CODE_SUCCESS,
    })
  } catch (error) {
    return await errorHandler(error, NextResponse)
  }
}
