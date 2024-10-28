import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { resend } from "../email/resend";
import { reactResetPasswordEmail } from "../email/rest-password";
import {
  jwt,
  bearer,
  organization,
  passkey,
  twoFactor,
  admin,
  multiSession,
} from "better-auth/plugins";
import { reactInvitationEmail } from "../email/invitation";
import * as schema from "../db/schema";
const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      account: schema.account,
      session: schema.session,
      verification: schema.verification,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
      twoFactor: schema.twoFactor,
      passkey: schema.passkey,
    },
  }),
  databaseHooks: {
    session: {
      create: {
        async before(session) {
          console.log("Before create session", session);
          return {
            data: session,
          };
        },
      },
    },
  },
  emailVerification: {
    async sendVerificationEmail(user, url) {
      console.log("Sending verification email to", user.email);
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
    sendOnSignUp: true,
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "github"],
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(user, url) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID || "",
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  //   },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID || "",
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  //   },
  //   discord: {
  //     clientId: process.env.DISCORD_CLIENT_ID || "",
  //     clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
  //   },
  //   microsoft: {
  //     clientId: process.env.MICROSOFT_CLIENT_ID || "",
  //     clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
  //   },
  //   twitch: {
  //     clientId: process.env.TWITCH_CLIENT_ID || "",
  //     clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
  //   },
  // },
  logger: {
    verboseLogging: true,
    disabled: false,
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const res = await resend.emails.send({
          from,
          to: data.email,
          subject: "You've been invited to join an organization",
          react: reactInvitationEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink:
              process.env.NODE_ENV === "development"
                ? `http://localhost:3000/accept-invitation/${data.id}`
                : `${
                    process.env.BETTER_AUTH_URL ||
                    process.env.NEXT_PUBLIC_APP_URL ||
                    process.env.VERCEL_URL
                  }/accept-invitation/${data.id}`,
          }),
        });
        console.log(res, data.email);
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP(user, otp) {
          await resend.emails.send({
            from,
            to: user.email,
            subject: "Your OTP",
            html: `Your OTP is ${otp}`,
          });
        },
      },
    }),
    passkey(),
    jwt({
      jwt: {
        definePayload: (user) => ({
          id: user.id,
          email: user.email,
        }),
      },
    }),
    bearer(),
    admin(),
    multiSession(),
  ],
});