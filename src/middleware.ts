import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { UserAuthData } from "@core/domain/Auth/Auth.types";

import parseCookies from "@utils/parseCookies";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // const user = parseCookies(req);
  // if (Object.keys(user).length != 3 && req.nextUrl.pathname !== "/login") {

  //   const url = req.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}
