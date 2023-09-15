import jwtDecode from "jwt-decode";

export async function decodeJWT(data: string) {
    const decodeTransactions = jwtDecode(data) as any;
    return decodeTransactions;
  }