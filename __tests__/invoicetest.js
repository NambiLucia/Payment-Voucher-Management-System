import request from "supertest";
import app from "../index.js";
import { describe, test, expect, beforeAll } from "@jest/globals";

describe("Voucher creation test", () => {
  let authToken;

  beforeAll(async () => {
    
    const res = await request(app)
      .post("/api/v2/users/login")
      .send({
        email: "ninah@email.com",
        password: "Ninah256" 
      });
    
    console.log("Login response:", res.status, res.body);
    
    if (res.status !== 200) {
      throw new Error(`Login failed: ${res.status} ${JSON.stringify(res.body)}`);
    }
    
    authToken = res.body.userToken;
    console.log("Token obtained successfully");
  });

  const voucher = {
    date: "2026-01-27",
    payee: "Macy",
    voucherDetails: "This is a voucher test",
    accountCode: "ACC-01",
    beneficiaryCode: "BEN-001",
    budgetCode: "BUD-001",
    exchangeRate: 3600,
    amountFigures: 4000,
    amountWords: "Four thousand shillings only"
  };

  test("Should fail when PDF file isn't attached", async () => {
    const response = await request(app)
      .post("/api/v2/vouchers/")
      .set("Authorization", `Bearer ${authToken}`)
      .field("date", voucher.date)
      .field("payee", voucher.payee)
      .field("voucherDetails", voucher.voucherDetails)
      .field("accountCode", voucher.accountCode)
      .field("beneficiaryCode", voucher.beneficiaryCode)
      .field("budgetCode", voucher.budgetCode)
      .field("exchangeRate", voucher.exchangeRate)
      .field("amountFigures", voucher.amountFigures)
      .field("amountWords", voucher.amountWords);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("PDF file is required");
  });
});

