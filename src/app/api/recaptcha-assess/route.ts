// src/app/api/recaptcha-assess/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const client = new RecaptchaEnterpriseServiceClient();

export async function POST(req: NextRequest) {
  const { token, siteKey, accountId, phoneNumber } = await req.json();
  if (!token || !phoneNumber || !siteKey) {
    return NextResponse.json({ error: "Faltan campos en el body" }, { status: 400 });
  }

  // 1) Proyecto y parent
  const projectId = await client.getProjectId();
  const parent    = `projects/${projectId}`;

  // 2) Crea la evaluación
  const [assessment] = await client.createAssessment({
    parent,
    assessment: {
      event: {
        token,
        siteKey,
        userInfo: {
          accountId,
          userIds: [{ phoneNumber }],
        },
      },
    },
  });

  // 3) Valida el token
  if (!assessment.tokenProperties?.valid) {
    return NextResponse.json(
      { error: "reCAPTCHA inválido", details: assessment.tokenProperties },
      { status: 400 }
    );
  }

  // 4) Devuelve success para que el cliente siga
  return NextResponse.json({ success: true });
}
