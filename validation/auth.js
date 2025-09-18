import { validateEmail } from "@/lib/utils"
import { ID } from "./message_lib_id"

const Joi = require("joi").extend(require("@joi/date"))

export const loginSchema = Joi.object()
  .keys({
    username: Joi.string().min(3).max(50).required().label("Username"),
    password: Joi.string().min(6).max(50).required().label("Password"),
    is_remember: Joi.boolean().required(),
  })
  .messages(ID)

export const registerSchema = Joi.object()
  .keys({
    username: Joi.string().min(3).max(50).required().label("Username"),
    email: Joi.string()
      .custom((value, helper) => (validateEmail(value) ? value : helper.message(`harus berupa email yang valid`)))
      .required()
      .label("Email"),
    password: Joi.string().min(6).max(50).required(),
  })
  .messages(ID)

export const verifikasiEmailSchema = Joi.object()
  .keys({
    email: Joi.string()
      .custom((value, helper) => (validateEmail(value) ? value : helper.message(`harus berupa email yang valid`)))
      .required()
      .label("Email"),
    code: Joi.string().trim().replace(/\s/g, "").length(6).required().label("Kode Verifikasi"),
  })
  .messages(ID)
