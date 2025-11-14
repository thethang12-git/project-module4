"use client"
import { useFormik } from "formik";
import emailjs from "@emailjs/browser";
import React, {useRef} from "react";
import {Button, Link, TextField, Typography } from "@mui/material";
import UserService from "@/src/service/dataService";
import { useRouter } from "next/navigation";
function Register() {
    const router = useRouter();
    const [toggle, setToggle] = React.useState(true);
    const otp = useRef<number | undefined>(undefined);
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            OTP :""
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
                            .catch((err) => alert("Kiểm tra lại email!"));
                    }
                    else {
                        alert('email đã có trên hệ thống, vui lòng đăng nhập, chuyển trang đăng nhập ')
                        console.log(user,values)
                        router.push("/login");
                    }
                }
                catch (error) {alert(error)}
            }
            else {
                if(Number(values.OTP) === otp.current) {
                    alert('đúng, thêm mới user')
                    await UserService.addUser(values)
                    router.push("/login");
                }
                else {alert('sai, nhâpj lại')}
            }
        }
    });

    return (
        <div className="h-screen flex items-center justify-center ">
            <form
                style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(8px)",
                }}
                onSubmit={formik.handleSubmit} className=" max-w-sm mx-auto p-6 border-2 border-gray-300 rounded-xl shadow-md w-full">
                <Typography variant="h5" align="center" mb={3}>
                    Đăng ký
                </Typography>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="name"
                        placeholder=""
                        value={formik.values.name}
                        autoComplete="off"
                        onChange={formik.handleChange} id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                    <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        UserName
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="email"
                        name="email"
                        placeholder=""
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        autoComplete="off"
                        id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required
                    />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Email
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="password"
                        name="password"
                        placeholder=""
                        autoComplete="off"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Password
                    </label>
                    <div style={{textAlign: "right"}}>

                    </div>
                </div>
                {
                    !toggle && (
                        <TextField
                    type={"number"}
                    id="outlined-basic"
                    label="OTP"
                    variant="outlined"
                    InputProps={{readOnly: toggle }}
                    fullWidth={true}
                    name = "OTP"
                    value={formik.values.OTP}
                    onChange={formik.handleChange}
                    />
                    )
                }
                <div style={{textAlign: "right"}}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => router.push("/login")}
                    >
                        Đăng nhập
                    </Link>
                </div>
                <Button style={{marginTop:"20px"}} type={"submit"} variant="contained">{toggle ? "Gửi OTP" : "Đăng ký"}</Button>
            </form>
        </div>
);
}

export default Register;
