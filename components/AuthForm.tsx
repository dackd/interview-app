"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "./FormField";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

const authFormSchema = (mode: FormType) => {
  return z.object({
    name: mode === "sign-up" ? z.string().min(2) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ mode }: { mode: FormType }) => {
  const router = useRouter();
  const isSignIn = mode === "sign-in";
  const formSchema = authFormSchema(mode);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (mode === "sign-up") {
      onSignUpSubmit(data);
    } else {
      onSignInSubmit(data);
    }
  };

  const onSignInSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredentials.user.getIdToken();

    if (!idToken) {
      toast.error("Sign in failed");
      return;
    }
    await signIn({
      email,
      idToken,
    });
    toast.success("Sign in successful");
    router.push("/");
  };

  const onSignUpSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, email, password } = data;
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const result = await signUp({
      uid: userCredentials.user.uid,
      name: name!,
      email,
      password,
    });

    if (!result?.success) {
      toast.error(result?.message);
      return;
    }

    toast.success("Account created successfully");
    router.push("/sign-in");
  };
  return (
    <div className="card-border lg:min-w-[566px] ">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Image src="/logo.svg" width={32} height={38} alt="logo" />
          <h2>PrepWise</h2>
        </div>
        <h3>Practice job interviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Your name"
                type="text"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              type="text"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              type="text"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
