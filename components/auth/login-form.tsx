"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";

export const LoginForm = () => {
   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get("callbackUrl");
   const urlError =
      searchParams.get("error") === "OAuthAccountNotLinked"
         ? "Email already in use with different provider!"
         : "";

   const [isPending, startTransition] = useTransition();

   const [showTwoFactor, setShowTwoFactor] = useState(false);
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const formMethods = useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = (values) => {
      setError("");
      setSuccess("");
      startTransition(() => {
         login(values, callbackUrl)
            .then((data) => {
               if (data?.error) {
                  formMethods.reset();
                  setError(data.error);
               }

               if (data?.success) {
                  formMethods.reset();
                  setSuccess(data.success);
               }

               if (data?.twoFactor) {
                  setShowTwoFactor(true);
               }
            })
            .catch(() => {
               setError("Something went wrong");
            });
      });
   };

   return (
      <CardWrapper
         headerLabel="Welcome back"
         backButtonLabel="Don't have an account?"
         backButtonHref="/auth/register"
         showSocial
      >
         <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
               <div className="space-y-4">
                  {!showTwoFactor && (
                     <>
                        <FormField
                           control={formMethods.control}
                           name="email"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Email</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="john.doe@example.com"
                                       type="email"
                                       disabled={isPending}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={formMethods.control}
                           name="password"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Password</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="**********"
                                       type="password"
                                       disabled={isPending}
                                    />
                                 </FormControl>
                                 <Button
                                    asChild
                                    size="sm"
                                    variant="link"
                                    className="px-0 font-normal"
                                 >
                                    <Link href="/auth/reset">Forgot password?</Link>
                                 </Button>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </>
                  )}
                  {showTwoFactor && (
                     <FormField
                        control={formMethods.control}
                        name="code"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Two Factor Code</FormLabel>
                              <FormControl>
                                 <Input {...field} placeholder="123456" disabled={isPending} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}
               </div>
               <FormError message={error || urlError} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isPending}>
                  {showTwoFactor ? "Confirm" : "Login"}
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
};
