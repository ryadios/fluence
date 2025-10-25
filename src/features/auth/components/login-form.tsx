"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [isOauthPending, setIsOauthPending] = useState(false);

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                // onSuccess: () => router.push("/"),
                onError: (ctx) => {
                    console.error("Login error:", ctx.error);
                    toast.error(ctx.error.message);
                },
            }
        );
    };

    const handleOAuth = async (provider: "google" | "github") => {
        setIsOauthPending(true);
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch {
            toast.error(`Failed to login!`);
        } finally {
            setIsOauthPending(false);
        }
    };

    const isPending = form.formState.isSubmitting || isOauthPending;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Login to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        onClick={() => handleOAuth("github")}
                                        disabled={isPending}
                                    >
                                        <Image
                                            alt="github"
                                            src="/logos/github.svg"
                                            width={20}
                                            height={20}
                                        />
                                        Continue with Github
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        onClick={() => handleOAuth("google")}
                                        disabled={isPending}
                                    >
                                        <Image
                                            alt="google"
                                            src="/logos/google.svg"
                                            width={20}
                                            height={20}
                                        />
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="soemthing@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isPending}
                                        variant="default"
                                    >
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="underline underline-offset-4"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
