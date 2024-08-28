import cookie from "cookie";
import { NextRequest } from "next/server";

function parseCookies(req: NextRequest) {
  return cookie.parse(req ? req.headers.get("cookie") || "" : document.cookie);
}

export default parseCookies;
