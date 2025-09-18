import { ENUMERATION_TYPE_WS_LOG, RESPONSE_CODE_INTERNAL_SERVER_ERROR, RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR, WS_LOG_STATUS_NEW } from "./constants"

const { Enumeration, EnumerationType, WsLog } = require("@/database/models")

export const createWsLog = async (logNameCode, payload) => {
  if (!logNameCode || !payload) {
    throw {
      status: RESPONSE_CODE_INTERNAL_SERVER_ERROR,
      message: `kegagalan pada saat membuat log`,
    }
  }

  const LogName = await Enumeration.findOne({
    where: { code: logNameCode, isActive: true },
    attributes: ["name"],
    include: [
      {
        model: EnumerationType,
        where: { code: ENUMERATION_TYPE_WS_LOG },
        attributes: [],
      },
    ],
  }).then((data) => {
    if (!data) {
      throw {
        status: RESPONSE_CODE_INTERNAL_SERVER_ERROR,
        message: RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
      }
    }
    return data.name
  })

  return await WsLog.create({
    logName: LogName,
    requestJson: JSON.stringify(payload),
    timeSubmitted: new Date(),
    status: WS_LOG_STATUS_NEW,
    createdDate: new Date(),
    createdBy: 1,
  })
}

export const updateWsLog = async (wsLog, status, response) => {
  if (!wsLog || !status || !response) {
    throw {
      status: RESPONSE_CODE_INTERNAL_SERVER_ERROR,
      message: `kegagalan pada saat mengupdate log`,
    }
  }

  return await wsLog.update({
    responseJson: JSON.stringify(response),
    timeResponse: new Date(),
    status: status,
    updatedDate: new Date(),
    updatedBy: 1,
  })
}
