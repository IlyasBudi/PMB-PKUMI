import { ENUMERATION_TYPE_WS_LOG, RESPONSE_CODE_INTERNAL_SERVER_ERROR, RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR, WS_LOG_STATUS_NEW } from "./constants"

const { Enumeration, EnumerationType, WsLog } = require("@/database/models")

export const createWsLog = async (logNameCode, payload) => {
  console.log("DEBUG: createWsLog START", { logNameCode, hasPayload: !!payload })

  if (!logNameCode || !payload) {
    console.error("DEBUG: logNameCode / payload missing!", { logNameCode, payload })
    throw {
      status: RESPONSE_CODE_INTERNAL_SERVER_ERROR,
      message: `kegagalan pada saat membuat log`,
    }
  }

  let LogName = null
  try {
    console.log("DEBUG: Query Enumeration.findOne dengan:", {
      code: logNameCode,
      ENUMERATION_TYPE_WS_LOG,
    })

    const data = await Enumeration.findOne({
      where: { code: logNameCode, is_active: true },
      attributes: ["id", "name", "code", "type_id"],
      include: [
        {
          model: EnumerationType,
          where: { code: ENUMERATION_TYPE_WS_LOG, is_active: true },
          attributes: ["id", "name", "code"],
        },
      ],
    })

    console.log("DEBUG: Enumeration query result:", data?.toJSON?.() || data)

    if (!data) {
      console.error("DEBUG: Enumeration tidak ditemukan untuk code:", logNameCode)
      throw {
        status: RESPONSE_CODE_INTERNAL_SERVER_ERROR,
        message: RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
      }
    }

    LogName = data.name
  } catch (err) {
    console.error("ERROR: Gagal query Enumeration untuk createWsLog:", err)
    throw err
  }

  try {
    console.log("DEBUG: Membuat WsLog dengan:", {
      logName: LogName,
      status: WS_LOG_STATUS_NEW,
      createdBy: 1,
    })

    const log = await WsLog.create({
      logName: LogName,
      requestJson: JSON.stringify(payload),
      timeSubmitted: new Date(),
      status: WS_LOG_STATUS_NEW,
      createdDate: new Date(),
      createdBy: 1,
    })

    console.log("DEBUG: WsLog berhasil dibuat:", log?.toJSON?.() || log)
    return log
  } catch (err) {
    console.error("ERROR: Gagal membuat WsLog:", err)
    throw err
  }
}

export const updateWsLog = async (wsLog, status, response) => {
  console.log("DEBUG: updateWsLog START", { hasWsLog: !!wsLog, status, hasResponse: !!response })

  if (!wsLog || !status || !response) {
    console.error("DEBUG: Param updateWsLog tidak lengkap!", { wsLog, status, response })
    throw {
      status: RESPONSE_CODE_INTERNAL_SERVER_ERROR,
      message: `kegagalan pada saat mengupdate log`,
    }
  }

  try {
    const updated = await wsLog.update({
      responseJson: JSON.stringify(response),
      timeResponse: new Date(),
      status: status,
      updatedDate: new Date(),
      updatedBy: 1,
    })
    console.log("DEBUG: updateWsLog sukses:", updated?.toJSON?.() || updated)
    return updated
  } catch (err) {
    console.error("ERROR: updateWsLog gagal:", err)
    throw err
  }
}
