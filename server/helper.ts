import crypto from "crypto";
import { resend } from "./client/Resend.js"

type notification = {
    userId: number,
    type: string,
    title: string,
    body: string,
    link: string
}

export async function createNotification({ userId, type, title, body, link }: notification, prisma: any) {
    try {
        const notification = await prisma.notification.create({
            data: { userId, type, title, body, link },
        })

        return notification
    } catch (e) {
        console.log(e)

    }
}

export async function getUserName(prisma: any, adopterId: Number) {
    const getAdopterName = await prisma.user.findFirst({
        where: {
            id: adopterId
        },
        select: { name: true }
    })

    return getAdopterName.name
}

export async function isUserAllowedInAdoptionProcess(userId: number, prisma: any) {
    const isUserAllowed = await prisma.adoptionProcess.findFirst({
        where: {
            OR: [{ ownerId: userId }, { adopterId: userId }]
        },
        select: { id: true }
    })

    return isUserAllowed
}

export async function verifyUserInConversation(id: number, prisma: any) {
    try {
        const verify = await prisma.conversation.findUnique({
            where: {
                id: id
            },
            select: {
                ownerId: true,
                adopterId: true,
            }
        })

        return verify
    } catch (e) {
        console.log(e)
    }
}

export function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    return name[0] + "***@" + domain;
}

export function maskPhone(phone: string) {
    return phone.slice(0, 2) + "****" + phone.slice(-2);
}

export function parseBRDateTime(dateStr: string, timeStr: string): Date | null {
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    const [hh, min] = timeStr.split(":").map(Number);

    if (!dd || !mm || !yyyy || !hh || min == undefined) return null;
    if (yyyy < 1900 || yyyy > 2100) return null;
    if (mm < 1 || mm > 12) return null;
    if (hh < 0 || hh > 23) return null;
    if (min < 0 || min > 59) return null;

    const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);

    if (
        d.getFullYear() !== yyyy ||
        d.getMonth() !== mm - 1 ||
        d.getDate() !== dd
    ) return null;

    return d;
}

export async function sendEmail(to: string, subject: string, html: string) {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
    });

    if (error) {
        return console.error({ error });
    }
    
    console.log({ data });
};

export function generateVerificationCode(): string {
    const code = crypto.randomInt(0, 1000000);
    return code.toString().padStart(6, "0");
}

export function htmlGenerate(code: string) {
    const html = `
  <div style="margin:0;padding:0;background:#fff7f2;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fff7f2;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,0.08);overflow:hidden;border:1px solid rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="padding:22px 24px;background:linear-gradient(90deg,#ff7b54,#ffb08a);">
                <div style="font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-weight:900;font-size:18px;letter-spacing:-0.02em;">
                  Pet Finder
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;color:rgba(255,255,255,0.92);font-size:13px;margin-top:6px;line-height:1.35;">
                  Verificação de email
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:22px 24px 10px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;font-size:16px;font-weight:900;line-height:1.25;margin:0 0 10px;">
                  Seu código de verificação chegou ✅
                </div>

                <div style="font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 16px;">
                  Use o código abaixo para confirmar seu email. Ele expira em poucos minutos por segurança.
                </div>

                <!-- Code box -->
                <div style="text-align:center;margin:18px 0 14px;">
                  <div style="display:inline-block;background:rgba(0,0,0,0.04);border:1px solid rgba(255,123,84,0.20);border-radius:14px;padding:14px 18px;">
                    <span style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:900;letter-spacing:0.28em;color:#4a4a4a;">
                      ${code}
                    </span>
                  </div>
                </div>

                <div style="font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:12px;line-height:1.6;margin:0 0 10px;">
                  Se você não solicitou este código, pode ignorar este email com segurança.
                </div>

                <div style="height:1px;background:rgba(0,0,0,0.08);margin:18px 0 14px;"></div>

                <div style="font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:12px;line-height:1.6;margin:0 0 8px;">
                  Dica: copie e cole o código no campo de verificação para agilizar.
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:14px 24px 22px 24px;background:#fffaf7;">
                <div style="font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:11px;line-height:1.6;">
                  Este é um email automático. Se precisar de ajuda, responda esta mensagem ou entre em contato pelo suporte do aplicativo.
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:11px;line-height:1.6;margin-top:8px;">
                  © ${new Date().getFullYear()} Pet Finder
                </div>
              </td>
            </tr>

          </table>

          <!-- Outer spacing note -->
          <div style="font-family:Arial,Helvetica,sans-serif;color:#9ca3af;font-size:11px;line-height:1.6;margin-top:14px;">
            Se o email não estiver aparecendo, verifique a caixa de spam/lixo eletrônico.
          </div>

        </td>
      </tr>
    </table>
  </div>
`;

    return html
}
