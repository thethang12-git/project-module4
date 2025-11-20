"use client"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import UserService from "@/src/service/dataService";

const clientId = "1090829690859-i89enmif243f8eb3k59gfimmsrmuccju.apps.googleusercontent.com";

function GoogleButton() {
    const router = useRouter();

    const persistSession = (opts: { email: string; name: string; avatar?: string; userId: string | number }) => {
        localStorage.setItem("email", JSON.stringify(opts.email));
        localStorage.setItem("user", JSON.stringify(opts.name));
        if (opts.avatar) {
            localStorage.setItem("avatar", JSON.stringify(opts.avatar));
        }
        localStorage.setItem("userId", JSON.stringify(opts.userId));
    };

    const fetchGoogleProfile = async (token: string) => {
        const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (!res.ok) {
            throw new Error("Failed to fetch Google profile");
        }
        return res.json();
    };

    const handleLoginSuccess = async (credentialResponse: any) => {
        try {
            const token = credentialResponse.credential;
            if (!token) {
                console.log("No credential returned");
                return;
            }

            const googleUser = await fetchGoogleProfile(token);
            const existingUser = await UserService.validateUser(googleUser.email);

            if (existingUser) {
                persistSession({
                    email: googleUser.email,
                    name: googleUser.name,
                    avatar: googleUser.picture,
                    userId: existingUser.id,
                });
            } else {
                const createResponse = await UserService.addUser({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: "",
                });
                const createdUser = createResponse.data;
                if (!createdUser?.id) {
                    throw new Error("Không thể lấy thông tin người dùng vừa tạo");
                }
                persistSession({
                    email: googleUser.email,
                    name: googleUser.name,
                    avatar: googleUser.picture,
                    userId: createdUser.id,
                });
            }

            router.push("/home");
        } catch (err) {
            console.error("Google login failed", err);
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="mt-2.5 flex justify-center">
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
            </div>
        </GoogleOAuthProvider>
    );
}

export default GoogleButton;
