"use client"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import UserService from "@/src/service/dataService";

const clientId = "1090829690859-i89enmif243f8eb3k59gfimmsrmuccju.apps.googleusercontent.com";

function GoogleButton() {
  const router = useRouter();

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            const token = credentialResponse.credential;
            console.log("Google credential:", token);
            if (!token) {
                console.log("No credential returned");
                return; 
                }
             fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
              .then(res => res.json())
              .then(async user => {
                const validate = await UserService.validateUser(user.email)
                if(validate) {
                    alert("Google sidebarHeader info: " + user.email + "chuyển trang");
                    router.push("/");
                }
                else {
                    alert("Khoong tim thay sidebarHeader");
                }
              })
              .catch(err => {
                console.error("Failed to fetch sidebarHeader info", err);
              });
          }}
        onError={() => {
          console.log("Login Failed");}}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleButton;
