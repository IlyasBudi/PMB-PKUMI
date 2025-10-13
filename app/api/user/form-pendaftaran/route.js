import { errorHandler } from "@/lib/api";
import { NextResponse } from "next/server";
import * as constants from "@/lib/constants";
import { getTokenData } from "@/lib/nextServers";
import { getPendaftaranData, updatePendaftaranData } from "@/services/user";
import { createWsLog, updateWsLog } from "@/lib/wsLog";
import { schemaValidation } from "@/lib/utils";
import { userPendaftaranSchemaBE } from "@/validation/user";

export async function PUT(request) {
  let payload = {};

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    payload = Object.fromEntries(formData.entries());
  } else {
    throw new Error("Unsupported content type");
  }

  const userData = getTokenData();
  let wsLog = null;
  try {
    let reqWsLog = { ...payload };
    if (reqWsLog.file_ijazah) {
      delete reqWsLog.file_ijazah;
    }
    if (reqWsLog.file_ktp) {
      delete reqWsLog.file_ktp;
    }
    if (reqWsLog.file_cv) {
      delete reqWsLog.file_cv;
    }

    wsLog = await createWsLog(
      constants.ENUMERATION_SERVICE_UPDATE_FORM_PENDAFTARAN,
      reqWsLog
    );
    const { error, value } = schemaValidation(userPendaftaranSchemaBE, payload);
    if (error) {
      throw {
        status: constants.RESPONSE_CODE_BAD_REQUEST,
        message:
          Object.values(error)[0] || constants.RESPONSE_MESSAGE_BAD_REQUEST,
      };
    }

    const response = await updatePendaftaranData(value, userData.username);
    await updateWsLog(wsLog, constants.WS_LOG_STATUS_DONE, response);
    return NextResponse.json(response, {
      status: response.status,
    });
  } catch (error) {
    if (wsLog) {
      await updateWsLog(
        wsLog,
        !error.name
          ? constants.WS_LOG_STATUS_DONE
          : constants.WS_LOG_STATUS_FAILED,
        error
      );
    }
    return await errorHandler(error, NextResponse);
  }
}

export async function GET() {
  const userData = getTokenData();
  try {
    // Get User Profile
    let response = {
      status: constants.RESPONSE_CODE_SUCCESS,
      message: constants.RESPONSE_MESSAGE_SUCCESS,
      data: await getPendaftaranData(userData.username),
    };

    return NextResponse.json(response, {
      status: constants.RESPONSE_CODE_SUCCESS,
    });
  } catch (error) {
    return await errorHandler(error, NextResponse);
  }
}
