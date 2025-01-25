"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import useStrapiApi from "@/hooks/useStrapiApi";
import CustomAlert from "@/components/Alert";
import useLocalStorage from "@/hooks/localStorageHook";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [registrationError, setRegistrationError] = useState<boolean>(false);


  const [token, setToken, clearToken] = useLocalStorage('jwtToken', '');
  const [user, setUser, clearUser] = useLocalStorage('user', '');

  const [error, setError] = useState({
    "title": "Registration Failed!",
    "descripton": "Error Occuerd!"
  });


  const { loading, postData } = useStrapiApi();

  async function registerUser() {
    const userData = { username, email, password };
  
    if (!username || !email || !password || !confirmPassword) {
      setRegistrationError(true);
      setError({
        title: "Missing Field!",
        descripton: "All fields are required!",
      });
      return;
    }
  
    if (password.length < 8) {
      setRegistrationError(true);
      setError({
        title: "Password too short!",
        descripton: "Password should be at least 8 characters!",
      });
      return;
    }
  
    if (password !== confirmPassword) {
      setRegistrationError(true);
      setError({
        title: "Passwords do not match!",
        descripton: "Please make sure both passwords are the same.",
      });
      return;
    }
  
    const response = await postData("/auth/local/register", userData);
  
    if (!response || response.error) {
      setRegistrationError(true);
      setError({
        title: "Registration Failed!",
        descripton: response?.error?.message || "An error occurred!",
      });
    } else {
      setToken(response.jwt);
      setUser(response.user);
      router.push("/chat");
    }
  }
  
  return (
    <div className="flex flex-row items-center justify-center h-screen bg-[#0F0F0F]">
      <Card className="w-full max-w-sm bg-[#E3FEFF] text-[#506A86] font-medium">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create an account!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col items-end">
            <Button className="w-full mb-3 bg-[#0F0F0F]" onClick={registerUser}>
              {" "}
              {loading ? "Siging up..." : "Sign up"}
            </Button>
            <Link href="/">
              <div className="text-xs hover:italic  hover:underline hover:cursor-pointer">
                Already have account?
              </div>
            </Link>
          </div>
        </CardFooter>
      </Card>
      {registrationError ? (
        <CustomAlert
          title={error.title}
          description={error.descripton}
          variant="destructive"
          setErrorOrSuccess={() => {
            setRegistrationError(false);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
