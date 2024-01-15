"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateVertificationToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendVertificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
   const validatedFields = LoginSchema.safeParse(values);

   if (!validatedFields.success) {
      return {
         error: "Invalid fields!",
      };
   }

   const { email, password } = validatedFields.data;

   const exisitingUser = await getUserByEmail(email);

   if (!exisitingUser || !exisitingUser.email || !exisitingUser.password) {
      return { error: "Email doesn't exist" };
   }

   if (!exisitingUser.emailVerified) {
      const vertificationToken = await generateVertificationToken(exisitingUser.email);
      await sendVertificationEmail(vertificationToken.email, vertificationToken.token);
      return {
         success: "Confirmation email sent!",
      };
   }

   try {
      await signIn("credentials", {
         email,
         password,
         redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
   } catch (error) {
      if (error instanceof AuthError) {
         switch (error.type) {
            case "CredentialsSignin":
               return { error: "Invalid credentials" };
            default:
               return { error: "Something went wrong" };
         }
      }
      throw error;
   }
};
