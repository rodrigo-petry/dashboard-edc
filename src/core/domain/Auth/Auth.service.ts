import { hcApi } from "@api";

import { AuthRequest, AuthResponse } from "./Auth.types";

export async function authenticate(
  credentials: AuthRequest
): Promise<AuthResponse> {
  const result = await hcApi.post("user/authenticate", credentials);

  return result.data as AuthResponse;
}
