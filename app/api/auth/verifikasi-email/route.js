import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import { verifikasiEmailSchema } from "@/validation/auth"
import { schemaValidation } from "@/lib/utils"

// Models
const { Users, UserNotification, sequelize, Student } = require("@/database/models")

export async function POST(request) {
  const payload = await request.json()

  let transaction = null
  let wsLog = null
  try {
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_VERIFIKASI_EMAIL, payload)
    const { error, value } = schemaValidation(verifikasiEmailSchema, payload)
    if (error) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }
    }

    // Find user by email
    const user = await Users.findOne({ where: { email: value.email, isDelete: false }, attributes: ["id", "isActive", "verificationCode", "username"] })

    if (user.isActive === true) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: "Akun sudah aktif",
      }
    }

    if (user.verificationCode && user.verificationCode != value.code) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: "Kode tidak sesuai",
      }
    } else {
      transaction = await sequelize.transaction()

      await user.update(
        {
          verificationCode: null,
          isActive: true,
          updatedDate: new Date(),
          updatedBy: user.id ? user.id : 1,
        },
        { transaction }
      )

      // Create App Notification
      await UserNotification.create(
        {
          username: user.username,
          title: "Pemberkasan",
          detail: "Harap melengkapi pemberkasan sebelum tenggat waktu yang ditentukan",
          url: constants.CLIENT_PATH.PROFILE,
          isRead: false,
          createdDate: new Date(),
          createdBy: 1,
        },
        { transaction }
      )

      await Student.create(
        {
          userId: user.id,
          registrationStatus: constants.ENUMERATION_REGISTRATION_STATUS_BARU,
          isActive: false,
          createdDate: new Date(),
          createdBy: 1,
        },
        { transaction }
      )

      let response = {
        status: constants.RESPONSE_CODE_SUCCESS,
        message: constants.RESPONSE_MESSAGE_SUCCESS,
      }

      await updateWsLog(wsLog, constants.WS_LOG_STATUS_DONE, response)
      await transaction.commit()
      return NextResponse.json(response, {
        status: response.status,
      })
    }
  } catch (error) {
    if (wsLog) {
      await updateWsLog(wsLog, !error.name ? constants.WS_LOG_STATUS_DONE : constants.WS_LOG_STATUS_FAILED, error)
    }
    return await errorHandler(error, NextResponse, transaction)
  }
}
