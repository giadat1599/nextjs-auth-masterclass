"use client";

import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { NewPasswordSchema } from "@/schemas";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
   const searchParams = useSearchParams();
   const token = searchParams.get("token");

   const [isPending, startTransition] = useTransition();

   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const formMethods = useForm<z.infer<typeof NewPasswordSchema>>({
      resolver: zodResolver(NewPasswordSchema),
      defaultValues: {
         password: "",
      },
   });

   const onSubmit: SubmitHandler<z.infer<typeof NewPasswordSchema>> = (values) => {
      setError("");
      setSuccess("");
      startTransition(() => {
         newPassword(values, token).then((data) => {
            setError(data.error);
            setSuccess(data.success);
         });
      });
   };

   return (
      <CardWrapper
         headerLabel="Enter a new password"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login"
      >
         <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
               <div className="space-y-4">
                  <FormField
                     control={formMethods.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 placeholder="******"
                                 type="password"
                                 disabled={isPending}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isPending}>
                  Reset password
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
};
