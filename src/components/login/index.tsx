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
    CardContent,
    Divider,
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
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(to bottom right, #c7d2fe 0%, #e9d5ff 50%, #fce7f3 100%)",
                padding: { xs: 2, sm: 3 },
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: 3,
                    boxShadow: "0px 10px 40px rgba(0,0,0,0.2)",
                    background: "#ffffff",
                    overflow: "hidden",
                }}
            >
                <CardContent
                    sx={{
                        padding: { xs: 3, sm: 4, md: 5 },
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontSize: { xs: "1.75rem", sm: "2rem" },
                                fontWeight: 700,
                                color: "#1a202c",
                                mb: 1,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Đăng nhập
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                fontSize: "0.875rem",
                            }}
                        >
                            Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn
                        </Typography>
                    </Box>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                fullWidth
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                required
                                placeholder="example@email.com"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "#f7fafc",
                                        "&:hover": {
                                            backgroundColor: "#edf2f7",
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "#ffffff",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        fontWeight: 500,
                                    },
                                }}
                            />

                            <TextField
                                label="Mật khẩu"
                                name="password"
                                type="password"
                                fullWidth
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "#f7fafc",
                                        "&:hover": {
                                            backgroundColor: "#edf2f7",
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "#ffffff",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        fontWeight: 500,
                                    },
                                }}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 1.75,
                                    mt: 1,
                                    borderRadius: 2,
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    boxShadow: "0px 4px 12px rgba(102, 126, 234, 0.4)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                                        boxShadow: "0px 6px 16px rgba(102, 126, 234, 0.5)",
                                    },
                                }}
                            >
                                Đăng nhập
                            </Button>

                            {/* Link to Register */}
                            <Box
                                sx={{
                                    textAlign: "center",
                                    mt: 2,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#718096",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    Chưa có tài khoản?{" "}
                                    <Link
                                        component="button"
                                        onClick={() => router.push("/register")}
                                        sx={{
                                            color: "#667eea",
                                            fontWeight: 600,
                                            textDecoration: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </Typography>
                            </Box>

                            {/* Divider */}
                            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                                <Divider sx={{ flex: 1 }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        px: 2,
                                        color: "#a0aec0",
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    HOẶC
                                </Typography>
                                <Divider sx={{ flex: 1 }} />
                            </Box>

                            {/* Google Button */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 1,
                                }}
                            >
                                <GoogleButton />
                            </Box>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
