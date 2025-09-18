import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import { errorHandler } from "@/lib/api"
import { schemaValidation } from "@/lib/utils"
import { registerSchema } from "@/validation/auth"
import nodemailer from "nodemailer"

export async function POST(request) {
  const payload = await request.json()

  try {
    const { error, value } = schemaValidation(registerSchema, payload)
    if (error) {
      let response = {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }

      return NextResponse.json(response, {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
      })
    }

    // Send email verification
    const length = 6
    const token = Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
      .toString(36)
      .slice(1)
      .toUpperCase()

    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
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
      verifLink,
    }

    return NextResponse.json(response, {
      status: constants.RESPONSE_CODE_SUCCESS,
    })
  } catch (error) {
    return await errorHandler(error, NextResponse)
  }
}
