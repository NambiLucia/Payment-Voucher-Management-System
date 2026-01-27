import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import request from "supertest";
import app from "../index.js";
import { describe, test, expect, beforeAll,afterEach } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);






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

  // delete test data- problem of foreign keys of documemts
  
//     afterEach(async () => {
//     await prisma.voucher.deleteMany();
//   });

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

test("Should create voucher successfully with PDF attached", async () => {
 
    const pdfPath = path.join(__dirname, "test-file.pdf");

    
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Test PDF file not found at: ${pdfPath}`);
    }


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
      .field("amountWords", voucher.amountWords)
      .attach("document", pdfPath);

  console.log("Response:", JSON.stringify(response.body, null, 2));

  // ADD THESE DEBUG LOGS
  console.log("Response status:", response.status);
  console.log("Response body:", JSON.stringify(response.body, null, 2));
  console.log("Response error:", response.error);



    // When successfully created
     expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    
  },15000);














});

