"use client";

import { useTransition, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

import { SettingsSchema } from "@/schemas";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function SettingsPage() {
   const user = useCurrentUser();
   const { update } = useSession();
   const [isPending, startTransition] = useTransition();
   const [error, setError] = useState<string | undefined>();
   const [success, setSuccess] = useState<string | undefined>();

   const formMethods = useForm<z.infer<typeof SettingsSchema>>({
      resolver: zodResolver(SettingsSchema),
      defaultValues: {
         name: user?.name || undefined,
         email: user?.email || undefined,
         password: undefined,
         newPassword: undefined,
         role: user?.role || undefined,
         isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      },
   });

   const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
      startTransition(() => {
         settings(values)
            .then((data) => {
               if (data.error) {
                  setError(data.error);
               }

               if (data.success) {
                  setSuccess(data.success);
                  update();
               }
            })
            .catch(() => {
               setError("Something went wrong!");
            });
      });
   };
   return (
      <Card className="w-[600px]">
         <CardHeader>
            <p className="text-2xl font-semibold text-center">⚙️ Settings</p>
         </CardHeader>
         <CardContent>
            <Form {...formMethods}>
               <form className="space-y-6" onSubmit={formMethods.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                     <FormField
                        control={formMethods.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input {...field} placeholder="john.doe" disabled={isPending} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {!user?.isOAuth && (
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
                                          placeholder="******"
                                          type="password"
                                          disabled={isPending}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={formMethods.control}
                              name="newPassword"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>New Password</FormLabel>
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
                        </>
                     )}
                     <FormField
                        control={formMethods.control}
                        name="role"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select
                                 disabled={isPending}
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={UserRole.USER}>User</SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {!user?.isOAuth && (
                        <FormField
                           control={formMethods.control}
                           name="isTwoFactorEnabled"
                           render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                 <div className="space-y-0.5">
                                    <FormLabel>Two Factor Authentication</FormLabel>
                                    <FormDescription>
                                       Enable two factor authentication for your account
                                    </FormDescription>
                                 </div>
                                 <FormControl>
                                    <Switch
                                       disabled={isPending}
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     )}
                  </div>
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button type="submit" disabled={isPending}>
                     Save
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
