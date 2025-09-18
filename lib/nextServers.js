import { headers } from "next/headers"
import { HEADERS_TOKEN_DATA_NAME } from "./constants"

export function getTokenData() {
  return JSON.parse(headers().get(HEADERS_TOKEN_DATA_NAME) || null)
}
