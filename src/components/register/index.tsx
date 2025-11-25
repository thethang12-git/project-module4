"use client";
import { useFormik } from "formik";
import emailjs from "@emailjs/browser";
import React, { useRef } from "react";
import {
    Button,
    Link,
    TextField,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import UserService from "@/src/service/dataService";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const [toggle, setToggle] = React.useState(true);
    const otp = useRef<number | undefined>(undefined);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            OTP: "",
        },
        onSubmit: async (values) => {
            if (toggle) {
                try {
                    const user =await UserService.validateUser(values.email);
                    if (!user) {
                        otp.current = Math.floor(100000 + Math.random() * 900000);
                        console.log(otp, values);
                        const template = {
                            userName: values.name,
                            reply_to: values.email,
                            password: values.password,
                            passcode: otp.current
                        };
                        emailjs
                            .send("service_0zq428t", "template_a1un4ul", template, "nlUaqVMyxnXcmXKTk")
                            .then(() => {
                                alert(' Xác minh địa chỉ email!')
                                setToggle(false)
                                setTimeout(() => otp.current = undefined, 300 * 1000);
                            })
                            .catch((err) => alert("Lỗi khi gửi email"));
                    }
                    else {
                        alert('Email đã tồn tại!')
                        console.log(user,values)
                        router.push("/login");
                    }
                }
                catch (error) {alert(error)}
            }
            else {
                if(Number(values.OTP) === otp.current) {
                    await UserService.addUser(values)
                    alert('Tạo tài khoản thành công!')
                    router.push("/login");
                }
                else {alert('sai OTP!')}
                }
            }
        });

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
            <Card
                sx={{
                    width: 380,
                    borderRadius: 4,
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <CardContent className="p-8">
                    <Typography
                        variant="h5"
                        className="font-semibold mb-6 text-center"
                        sx={{ fontSize: "1.8rem" }}
                    >
                        Đăng ký tài khoản
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>

                        <TextField
                            label="Họ và tên"
                            name="name"
                            fullWidth
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            fullWidth
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            label="Mật khẩu"
                            type="password"
                            name="password"
                            fullWidth
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            sx={{ mb: 3 }}
                        />

                        {!toggle && (
                            <TextField
                                label="Nhập mã OTP"
                                name="OTP"
                                type="number"
                                fullWidth
                                value={formik.values.OTP}
                                onChange={formik.handleChange}
                                sx={{ mb: 3 }}
                            />
                        )}

                        <div className="text-right mb-4">
                            <Link
                                component="button"
                                onClick={() => router.push("/login")}
                                className="text-blue-600 hover:underline"
                            >
                                Đã có tài khoản? Đăng nhập
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                background:
                                    "linear-gradient(90deg, #4F46E5 0%, #9333EA 100%)",
                            }}
                            variant="contained"
                        >
                            {toggle ? "GỬI OTP" : "ĐĂNG KÝ"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
