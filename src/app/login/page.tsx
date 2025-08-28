"use client"
import { authClient } from "@/app/lib/auth-client"

export default function Login() {
    const handleGoogleLogin = () => {
        authClient.signIn.social(
            {
                provider: "google",
                callbackURL: "http://localhost:3000"
            },
        )
    }

    return (
        <div>
            <h1>Login</h1>
            <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleGoogleLogin}>Google
            </button>
        </div>
    )
}