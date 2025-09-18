import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { schemaValidation } from "@/lib/utils"
import { registerSchema } from "@/validation/auth"
import { encryptCrypto } from "@/lib/crypto"
import { Op } from "sequelize"
import { createWsLog, updateWsLog } from "@/lib/wsLog"
import nodemailer from "nodemailer"

// MODELS
const { Users, Enumeration, EnumerationType, sequelize } = require("@/database/models")

export async function POST(request) {
  const payload = await request.json()

  let transaction = null
  let wsLog = null
  try {
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_REGISTER, payload)
    const { error, value } = schemaValidation(registerSchema, payload)
    if (error) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }
    }

    // CHECK IF USERNAME OR EMAIL IS EXIST
    await Users.findOne({
      where: {
        [Op.or]: {
          username: value.username,
          email: value.email,
        },
        isDelete: false,
      },
      attributes: ["username", "email"],
      raw: true,
    }).then((data) => {
      if (!data) return
      if (data?.username === value.username) {
        throw {
          status: constants.RESPONSE_CODE_BAD_REQUEST,
          message: `Username ${value.username} sudah digunakan`,
        }
      }
      if (data?.email === value.email) {
        throw {
          status: constants.RESPONSE_CODE_BAD_REQUEST,
          message: `Email ${value.email} sudah digunakan`,
        }
      }
    })

    // FIND USER TYPE
    const typeId = await Enumeration.findOne({
      where: { code: constants.ENUMERATION_USERS_TYPE_MAHASISWA, isActive: true },
      attributes: ["id", "typeId"],
      include: [
        {
          model: EnumerationType,
          where: { code: constants.ENUMERATION_TYPE_USERS_TYPE, isActive: true },
          attributes: [],
        },
      ],
    }).then((data) => {
      if (!data) {
        throw {
          status: constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR,
          message: constants.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
        }
      }
      return data.id
    })

    // GENERATE VERIFICATION CODE
    const length = 6
    const token = Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
      .toString(36)
      .slice(1)
      .toUpperCase()

    // ENCRYPT PASSWORD REQUEST
    value.password = encryptCrypto(value.password, process.env.CRYPTO_SECRET_KEY)

    transaction = await sequelize.transaction()
    await Users.create(
      {
        ...value,
        typeId,
        verificationCode: token,
        isActive: false,
        createdDate: new Date(),
        createdBy: 1,
      },
      { transaction }
    )

    // Send email verification
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // true untuk port 465, false untuk 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    })

    const verifLink = `${process.env.BASE_URL}verifikasi-email?email=${value.email}&code=${token}`

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: value.email,
      subject: "PKUMI - Verifikasi Account Email",
      html: `<h3>Dear ${value.username}</h3>
            <p>Thank you for signing up with PKUMI.</p>
            <p>Your verification code is: <b>${token}</b></p>
            <br>
            <p>Please click the link below to verify your email.</p>
            <a href="${verifLink}" role="button" style="box-shadow: 0px 10px 14px -7px #276873;background:linear-gradient(to bottom, #599bb3 5%, #408c99 100%);background-color:#599bb3;border-radius:8px;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:20px;font-weight:bold;padding:13px 32px;text-decoration:none;text-shadow:0px 1px 0px #3d768a;">Confirm Email</a>
            <br>
            <br>
            <p>If you did not sign up with PKUMI, please ignore this email.</p>`,
    })

    let response = {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
    }

    await updateWsLog(wsLog, constants.WS_LOG_STATUS_DONE, response)
    await transaction.commit()

    return NextResponse.json(response, {
      status: response.status,
    })
  } catch (error) {
    if (wsLog) {
      await updateWsLog(wsLog, !error.name ? constants.WS_LOG_STATUS_DONE : constants.WS_LOG_STATUS_FAILED, error)
    }
    return await errorHandler(error, NextResponse, transaction)
  }
}
