"use client";
import React from "react";
import { useFormik } from "formik";
import {
    Button,
    TextField,
    Box,
    Typography,
    Link,
    Card,
    CardContent
} from "@mui/material";
import GoogleButton from "../OathGoogle_button";
import UserService from "@/src/service/dataService";
import { useRouter } from "next/navigation";

function Login() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            const user = await UserService.validateUser(values.email, values.password);

            if (user) {
                localStorage.setItem("email", JSON.stringify(values.email));
                localStorage.setItem("user", JSON.stringify(user.name));
                localStorage.setItem("userId", JSON.stringify(user.id));

                alert("Đăng nhập thành công! Chuyển trang...");
                router.push("/home");
            } else {
                alert("Sai email hoặc mật khẩu!");
            }
        },
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
                        className="font-semibold text-center mb-6"
                        sx={{ fontSize: "1.8rem" }}
                    >
                        Đăng nhập
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            sx={{ mb: 3 }}
                            required
                        />

                        <TextField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            fullWidth
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            sx={{ mb: 3 }}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                mt: 1,
                                background:
                                    "linear-gradient(90deg, #4F46E5 0%, #9333EA 100%)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(90deg, #4338CA 0%, #7E22CE 100%)",
                                },
                            }}
                        >
                            Đăng nhập
                        </Button>

                        <div className="text-right mt-2 mb-4">
                            <Link
                                component="button"
                                onClick={() => router.push("/register")}
                                className="text-blue-600 hover:underline"
                            >
                                Chưa có tài khoản? Đăng ký
                            </Link>
                        </div>

                        <Typography align="center" mb={1}>
                            — Hoặc —
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <GoogleButton />
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;
