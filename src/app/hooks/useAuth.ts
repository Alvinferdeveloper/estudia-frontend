import { authClient } from "@/app/lib/auth-client";

export default function useAuth() {
    return authClient.useSession();
}