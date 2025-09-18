import * as constants from "@/lib/constants"

export const errorHandler = async (error, NextResponse, transaction) => {
  if (transaction) await transaction.rollback()

  if (!error.name) {
    return NextResponse.json(
      {
        status: error.status || constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR,
        message: error.message || constants.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
      },
      { status: error.status || constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR }
    )
  }

  console.log(error)
  return NextResponse.json(
    {
      status: constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR,
      message: constants.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
      details: error.message,
    },
    { status: constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR }
  )
}

export const errorHandlerServer = (error) => {
  return {
    status: !error.name ? error.status : constants.RESPONSE_CODE_INTERNAL_SERVER_ERROR,
    message: !error.name ? error.message : constants.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
  }
}

export const parsingResponse = (response) => {
  if (response?.status === constants.RESPONSE_CODE_SUCCESS) {
    return response
  } else {
    throw response
  }
}
