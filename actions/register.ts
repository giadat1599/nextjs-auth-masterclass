"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVertificationToken } from "@/lib/token";
import { sendVertificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
   const validatedFields = RegisterSchema.safeParse(values);

   if (!validatedFields.success) {
      return {
         error: "Invalid fields!",
      };
   }

   const { email, password, name } = validatedFields.data;
   const hashedPassword = await bcrypt.hash(password, 10);

   const exisitingUser = await getUserByEmail(email);
   if (exisitingUser) {
      return {
         error: "Email already in use!",
      };
   }

   await db.user.create({
      data: {
         name,
         email,
         password: hashedPassword,
      },
   });

   const vertificationToken = await generateVertificationToken(email);

   await sendVertificationEmail(vertificationToken.email, vertificationToken.token);

   return {
      success: "Confirmation email sent!",
   };
};
