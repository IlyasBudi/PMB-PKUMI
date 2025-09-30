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
console.log("DEBUG: Models loaded?", {
  Users: !!Users,
  Enumeration: !!Enumeration,
  EnumerationType: !!EnumerationType,
  sequelize: !!sequelize,
})
const { Users, Enumeration, EnumerationType, sequelize } = require("@/database/models")

export async function POST(request) {
  const payload = await request.json()
  console.log("1. payload:", payload)

  let transaction = null
  let wsLog = null

  try {
    console.log("DEBUG: sebelum createWsLog")
    wsLog = await createWsLog(constants.ENUMERATION_SERVICE_REGISTER, payload)
    console.log("2. wsLog created:", wsLog?.id)

    // Validate schema
    const { error, value } = schemaValidation(registerSchema, payload)
    if (error) {
      console.log("3. Validation error:", error)
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message: Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      }
    }
    console.log("3. Validation OK, value:", value)

    // Cek apakah username/email sudah ada
    let existingUser = null
    try {
      existingUser = await Users.findOne({
        where: {
          [Op.or]: [{ username: value.username }, { email: value.email }],
          is_delete: false,
        },
        attributes: ["username", "email"],
        raw: true,
      })
      console.log("4. existingUser:", existingUser)
    } catch (err) {
      console.error("4. ERROR saat cek existing user:", err)
      throw err
    }

    if (existingUser) {
      if (existingUser.username === value.username) {
        throw { status: 400, message: `Username ${value.username} sudah digunakan` }
      }
      if (existingUser.email === value.email) {
        throw { status: 400, message: `Email ${value.email} sudah digunakan` }
      }
    }

    // Cari typeId Mahasiswa
    let typeId = null
    try {
      const enumData = await Enumeration.findOne({
        where: { code: constants.ENUMERATION_USERS_TYPE_MAHASISWA, is_active: true },
        attributes: ["id", "type_id"],
        include: [
          {
            model: EnumerationType,
            where: { code: constants.ENUMERATION_TYPE_USERS_TYPE, is_active: true },
            attributes: ["id", "name", "code"],
          },
        ],
      })
      console.log("5. Enumeration result:", enumData?.toJSON?.() || enumData)
      if (!enumData) throw new Error("Enumeration MHS tidak ditemukan")
      typeId = enumData.id
    } catch (err) {
      console.error("5. ERROR saat ambil Enumeration:", err)
      throw { status: 500, message: "Gagal ambil tipe user (Enumeration)" }
    }

    // Generate verification code
    const token = Math.random().toString(36).substring(2, 8).toUpperCase()
    console.log("6. Generated token:", token)

    // Encrypt password
    try {
      value.password = encryptCrypto(value.password, process.env.CRYPTO_SECRET_KEY)
      console.log("7. Password encrypted:", value.password)
    } catch (err) {
      console.error("7. ERROR encrypt password:", err)
      throw err
    }

    // Insert user
    try {
      transaction = await sequelize.transaction()
      const newUser = await Users.create(
        {
          ...value,
          type_id: typeId,
          is_active: false,
          created_date: new Date(),
          created_by: 1,
        },
        { transaction }
      )
      console.log("8. User created:", newUser?.toJSON?.() || newUser)
      await transaction.commit()
    } catch (err) {
      console.error("8. ERROR saat insert user:", err)
      if (transaction) await transaction.rollback()
      throw err
    }

    // Email verification
    const verifLink = `${process.env.BASE_URL}verifikasi-email?email=${value.email}&code=${token}`
    console.log("9. Verification link:", verifLink)

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      })

      await transporter.verify()
      console.log("9. SMTP OK")

      if (process.env.DB_ENVIRONMENT !== "local") {
        await transporter.sendMail({
          from: `"PMB PKU-MI" <${process.env.MAIL_USER}>`,
          to: value.email,
          subject: "PKUMI - Verifikasi Account Email",
          html: `<p>Kode verifikasi: <b>${token}</b></p><a href="${verifLink}">Klik link verifikasi</a>`,
        })
        console.log("9. Email sent to:", value.email)
      }
    } catch (err) {
      console.error("9. ERROR kirim email:", err)
    }

    // Response OK
    const response = { status: 200, message: "SUCCESS" }
    await updateWsLog(wsLog, constants.WS_LOG_STATUS_DONE, response)

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("X. Register API Error RAW:", error)
    return NextResponse.json({ message: error.message || "Unknown error", error }, { status: error.status || 500 })
  }
}
