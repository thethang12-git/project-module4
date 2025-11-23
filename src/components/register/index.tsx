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
    Box,
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
                    const user = await UserService.validateUser(values.email);
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
                                alert('Xác minh địa chỉ email!')
                                setToggle(false)
                                setTimeout(() => otp.current = undefined, 300 * 1000);
                            })
                            .catch((err) => alert("Lỗi khi gửi email"));
                    }
                    else {
                        alert('Email đã tồn tại!')
                        console.log(user, values)
                        router.push("/login");
                    }
                }
                catch (error) { alert(error) }
            }
            else {
                if (Number(values.OTP) === otp.current) {
                    await UserService.addUser(values)
                    alert('Tạo tài khoản thành công!')
                    router.push("/login");
                }
                else { alert('Sai OTP!') }
            }
        }
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
                            Đăng ký tài khoản
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                fontSize: "0.875rem",
                            }}
                        >
                            {toggle
                                ? "Vui lòng điền thông tin để tạo tài khoản mới"
                                : "Nhập mã OTP đã được gửi đến email của bạn"}
                        </Typography>
                    </Box>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            {toggle ? (
                                <>
                                    <TextField
                                        label="Họ và tên"
                                        name="name"
                                        fullWidth
                                        value={formik.values.name}
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

                                    <TextField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        fullWidth
                                        value={formik.values.email}
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

                                    <TextField
                                        label="Mật khẩu"
                                        type="password"
                                        name="password"
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
                                </>
                            ) : (
                                <TextField
                                    label="Nhập mã OTP"
                                    name="OTP"
                                    type="number"
                                    fullWidth
                                    value={formik.values.OTP}
                                    onChange={formik.handleChange}
                                    required
                                    placeholder="Nhập 6 chữ số"
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
                            )}

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
                                {toggle ? "Gửi mã OTP" : "Xác nhận đăng ký"}
                            </Button>

                            {/* Link to Login */}
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
                                    Đã có tài khoản?{" "}
                                    <Link
                                        component="button"
                                        onClick={() => router.push("/login")}
                                        sx={{
                                            color: "#667eea",
                                            fontWeight: 600,
                                            textDecoration: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
