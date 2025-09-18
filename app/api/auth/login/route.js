import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { schemaValidation, sequelizeDataParser } from "@/lib/utils"
import { loginSchema } from "@/validation/auth"
import { decryptCrypto } from "@/lib/crypto"
import { Op } from "sequelize"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import { sign } from "@/lib/jwt"
import { cookies } from "next/headers"

// MODELS
const { Users, Enumeration, EnumerationType } = require("@/database/models")

export async function POST(request) {
  const payload = await request.json()

  let wsLog = null
  try {
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_LOGIN, payload)
    const { error, value } = schemaValidation(loginSchema, payload)
    if (error) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }
    }

    // CHECK IF USERNAME OR EMAIL IS EXIST
    const user = await Users.findOne({
      where: {
        [Op.or]: {
          username: value.username,
          email: value.username,
        },
        isActive: true,
        isDelete: false,
      },
      attributes: ["username", "email", "password"],
      include: [
        {
          model: Enumeration,
          attributes: ["name"],
          required: true,
          where: { code: {[Op.or]: [constants.ENUMERATION_USERS_TYPE_ADMIN, constants.ENUMERATION_USERS_TYPE_MAHASISWA]} },
          include: [
            {
              model: EnumerationType,
              where: { code: constants.ENUMERATION_TYPE_USERS_TYPE },
              attributes: [],
              required: true,
            },
          ],
        },
      ],
    }).then((data) => {
      if (!data) {
        throw {
          status: constants.RESPONSE_CODE_NOT_FOUND,
          message: `Username ${value.username} tidak terdaftar`,
        }
      }
      return sequelizeDataParser(data)
    })

    const userPassword = decryptCrypto(user.password)
    if (!userPassword) {
      throw {
        status: constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR,
        message: constants.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
      }
    }
    if (userPassword !== value.password) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: "Password yang anda masukan tidak sesuai",
      }
    }

    const token = await sign(
      {
        username: user.username,
        email: user.email,
        user_type: user.Enumeration.name.toLowerCase(),
      },
      value.is_remember
    )

    cookies().set(process.env.NEXT_PUBLIC_APP_TOKEN_NAME, token, {
      secure: true,
    })

    let response = {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
      data: { token },
    }

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
