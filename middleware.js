import { NextResponse } from "next/server"
import * as constants from "@/lib/constants"
import * as jwt from "@/lib/jwt"
import { menuList } from "./services/menu"

export default async function middleware(req) {
  const accessToken = req.cookies.get(process.env.NEXT_PUBLIC_APP_TOKEN_NAME)?.value
  const url = req.nextUrl.clone()

  console.log('Middleware Debug:', {
    path: url.pathname,
    hasToken: !!accessToken,
    tokenName: process.env.NEXT_PUBLIC_APP_TOKEN_NAME
  })

  if (accessToken) {
    const verifyToken = await jwt.verify(accessToken)
    if (verifyToken) {
      let refreshToken = null
      let tokenData = { ...verifyToken }
      delete tokenData.exp
      delete tokenData.iat
      delete tokenData.nbf

      const response = NextResponse.next()
      if (verifyToken.exp) {
        // REFRESH TOKEN
        const remainTime = parseInt(verifyToken.exp) - Math.floor(Date.now() / 1000)
        if (remainTime < 5000) {
          const newToken = await jwt.sign(tokenData)

          refreshToken = {
            name: process.env.NEXT_PUBLIC_APP_TOKEN_NAME,
            value: newToken,
            secure: true,
          }
        }
      }

      // ADD TOKEN DATA TO HEADER
      response.headers.append(constants.HEADERS_TOKEN_DATA_NAME, JSON.stringify(tokenData))

      if (url.pathname.startsWith("/api")) {
        if (!Object.values(constants.API_PATH).includes(url.pathname)) {
          return NextResponse.json(
            {
              status: constants.RESPONSE_CODE_NOT_FOUND,
              message: constants.RESPONSE_MESSAGE_ROUTE_NOT_FOUND,
            },
            { status: constants.RESPONSE_CODE_NOT_FOUND }
          )
        } else {
          if (refreshToken) {
            response.cookies.set(refreshToken)
          }
          return response
        }
      } else {
        if (constants.ROUTES_WITHOUT_NAVIGATOR.includes(url.pathname)) {
          if (url.pathname === constants.CLIENT_PATH.NOT_FOUND) {
            if (refreshToken) {
              response.cookies.set(refreshToken)
            }
            return response
          } else {
            url.pathname = constants.CLIENT_PATH.DASHBOARD
            const responseRedirect = NextResponse.redirect(url)
            responseRedirect.headers.append(constants.HEADERS_TOKEN_DATA_NAME, JSON.stringify(tokenData))
            if (refreshToken) {
              responseRedirect.cookies.set(refreshToken)
            }
            return responseRedirect
          }
        } else {
          const accessible = Object.values(constants.CLIENT_PATH)
          if (!accessible.includes(url.pathname)) {
            url.pathname = constants.CLIENT_PATH.NOT_FOUND
            const responseRedirect = NextResponse.redirect(url)
            responseRedirect.headers.append(constants.HEADERS_TOKEN_DATA_NAME, JSON.stringify(tokenData))
            if (refreshToken) {
              responseRedirect.cookies.set(refreshToken)
            }
            return responseRedirect
          } else {
            if (!menuList[verifyToken?.user_type].includes(url.pathname)) {
              url.pathname = constants.CLIENT_PATH.NOT_FOUND
              const responseRedirect = NextResponse.redirect(url)
              responseRedirect.headers.append(constants.HEADERS_TOKEN_DATA_NAME, JSON.stringify(tokenData))
              if (refreshToken) {
                responseRedirect.cookies.set(refreshToken)
              }
              return responseRedirect
            } else {
              if (refreshToken) {
                response.cookies.set(refreshToken)
              }
              return response
            }
          }
        }
      }
    } else {
      if (url.pathname.startsWith("/api")) {
        if (constants.API_ROUTES_WITHOUT_TOKEN.includes(url.pathname)) {
          return NextResponse.next()
        } else {
          if (!Object.values(constants.API_PATH).includes(url.pathname)) {
            return NextResponse.json(
              {
                status: constants.RESPONSE_CODE_NOT_FOUND,
                message: constants.RESPONSE_MESSAGE_ROUTE_NOT_FOUND,
              },
              { status: constants.RESPONSE_CODE_NOT_FOUND }
            )
          } else {
            return NextResponse.json(
              {
                status: constants.RESPONSE_CODE_UNAUTHORIZED,
                message: constants.RESPONSE_MESSAGE_UNAUTHORIZED,
              },
              { status: constants.RESPONSE_CODE_UNAUTHORIZED }
            )
          }
        }
      } else {
        if (constants.CLIENT_ROUTES_WITHOUT_TOKEN.includes(url.pathname)) {
          return NextResponse.next()
        } else {
          if (!Object.values(constants.CLIENT_PATH).includes(url.pathname)) {
            url.pathname = constants.CLIENT_PATH.NOT_FOUND
            return NextResponse.redirect(url)
          } else {
            url.pathname = constants.CLIENT_PATH.LOGIN
            return NextResponse.redirect(url)
          }
        }
      }
    }
  } else {
    if (url.pathname.startsWith("/api")) {
      if (constants.API_ROUTES_WITHOUT_TOKEN.includes(url.pathname)) {
        return NextResponse.next()
      } else {
        if (!Object.values(constants.API_PATH).includes(url.pathname)) {
          return NextResponse.json(
            {
              status: constants.RESPONSE_CODE_NOT_FOUND,
              message: constants.RESPONSE_MESSAGE_ROUTE_NOT_FOUND,
            },
            { status: constants.RESPONSE_CODE_NOT_FOUND }
          )
        } else {
          return NextResponse.json(
            {
              status: constants.RESPONSE_CODE_UNAUTHORIZED,
              message: constants.RESPONSE_MESSAGE_UNAUTHORIZED,
            },
            { status: constants.RESPONSE_CODE_UNAUTHORIZED }
          )
        }
      }
    } else {
      if (constants.CLIENT_ROUTES_WITHOUT_TOKEN.includes(url.pathname)) {
        return NextResponse.next()
      } else {
        if (!Object.values(constants.CLIENT_PATH).includes(url.pathname)) {
          url.pathname = constants.CLIENT_PATH.NOT_FOUND
          return NextResponse.redirect(url)
        } else {
          url.pathname = constants.CLIENT_PATH.LOGIN
          return NextResponse.redirect(url)
        }
      }
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.).*)"],
}
