import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { cookies } from "next/headers"

export async function GET() {
  cookies().delete(process.env.NEXT_PUBLIC_APP_TOKEN_NAME)

  return NextResponse.json(
    {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
    },
    {
      status: constants.RESPONSE_CODE_SUCCESS,
    }
  )
}
