import React, { useState, } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import "../Login/Login.css";
import "../RegisterEmployee/RegisterEmployee.css";
import loginImage from "../../assets/0002_1_explore-how-the-fast-paced-digital-revol_41pgg1YCT6WgD7h_l4EPKQ_CBbx0yxyRnirBWGDA1nx3g_cover.jpeg";
import registerGraphic from '../../assets/ai_register.png'
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';

export default function RegisterCompany() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    let [messageError, setMessageErro] = useState('');

    async function handleRegisterEmployee(values) {
        console.log("Form submission triggered:", values);

        setIsLoading(true);
        const formData = new FormData();
        formData.append("Name", values.Name);
        formData.append("Email", values.Email);
        formData.append("Password", values.Password);
        formData.append("image", values.image || ""); // fallback to avoid undefined
        formData.append("IndustryId", values.IndustryId);

        try {
            // MOCK BACKEND
            await new Promise(resolve => setTimeout(resolve, 1000));

            const companies = JSON.parse(localStorage.getItem('companies') || '[]');
            if (companies.some(c => c.email === values.Email)) {
                throw { response: { data: "Email already registered", status: 409 } };
            }

            const newCompany = {
                companyId: Date.now().toString(),
                name: values.Name,
                email: values.Email,
                password: values.Password,
                industryId: values.IndustryId,
                role: 'Company'
            };

            companies.push(newCompany);
            localStorage.setItem('companies', JSON.stringify(companies));

            // Also add to generic users for login
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({
                id: newCompany.companyId,
                email: values.Email,
                password: values.Password,
                name: values.Name,
                role: 'Company'
            });
            localStorage.setItem('users', JSON.stringify(users));


            const data = { companyId: newCompany.companyId };
            setMessageErro("Company registered successfully (Mocked).");
            console.log("API response:", data);

            if (data.companyId) {
                localStorage.setItem('company-id', data.companyId);
                navigate("/login");
            }
        } catch (error) {
            console.error("Server returned:", error);
            if (error.response) {
                setMessageErro(`Error: ${error.response.data}`);
            } else {
                setMessageErro("Error: Something went wrong during registration.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const validation = Yup.object({
        Name: Yup.string().required("Name is required").min(6).max(30),
        Email: Yup.string().required("Email is required").email("Invalid email"),
        Password: Yup.string()
            .required("Password is required")
            .matches(/^[A-Z][a-z0-9]{5,10}$/, "Password must start with uppercase"),
        IndustryId: Yup.string().required("IndustryId is required"),
    });

    const formik = useFormik({
        initialValues: {
            Name: "",
            Email: "",
            Password: "",
            image: "",
            IndustryId: "",
        },
        validationSchema: validation,
        onSubmit: handleRegisterEmployee,
    });

    return (
            <div className="container-fluid p-0 login-grand-wrapper">
                <Header />
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center py-5 hero-reg">
                        <div className="col-lg-6 mb-5 mb-lg-0 text-center d-none d-lg-block">
                            <div className="login-image-container position-relative w-75 mx-auto">
                                <div className="glow-effect"></div>
                                <img className="img-fluid rounded-4 shadow-lg position-relative z-2" src={registerGraphic} alt="Enterprise Registration" />
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="login-glass-panel p-5 rounded-4 shadow-lg text-center">
                                <h1 className="text-white fw-bold mb-2">Enterprise <span className="text-cyan">Onboarding</span></h1>
                                <p className="text-secondary mb-4">Register your company to access top tier talent.</p>

                                {messageError && (
                                    <div className="alert alert-danger custom-alert">
                                        <i className="fa-solid fa-triangle-exclamation me-2"></i>{messageError}
                                    </div>
                                )}
                                
                                <form className='w-100 d-flex flex-column align-items-center justify-content-center'
                                    onSubmit={formik.handleSubmit}>

                                    <div className="industry w-100 mb-3 text-start">
                                        <Link className='text-cyan text-decoration-none small fw-bold' to={"/industry"}>
                                            <i className="fa-solid fa-magnifying-glass me-2"></i>Find Your Industry UUID
                                        </Link>
                                    </div>

                                    {/* Name */}
                                    <input className='glass-input w-100 mb-3' type="text" name="Name" placeholder='Company Name'
                                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        value={formik.values.Name} />
                                    {formik.touched.Name && formik.errors.Name &&
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">{formik.errors.Name}</div>}

                                    {/* Email */}
                                    <input className='glass-input w-100 mb-3' type="email" name="Email" placeholder='Corporate Email'
                                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        value={formik.values.Email} />
                                    {formik.touched.Email && formik.errors.Email &&
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">{formik.errors.Email}</div>}

                                    {/* Password */}
                                    <input className='glass-input w-100 mb-3' type="password" name="Password" placeholder='Security Key'
                                        autoComplete="current-password"
                                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        value={formik.values.Password} />
                                    {formik.touched.Password && formik.errors.Password &&
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">{formik.errors.Password}</div>}

                                    {/* Industry ID */}
                                    <input className='glass-input w-100 mb-4' type="text" name="IndustryId" placeholder='Industry Identifier (UUID)'
                                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        value={formik.values.IndustryId} />
                                    {formik.touched.IndustryId && formik.errors.IndustryId &&
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">{formik.errors.IndustryId}</div>}

                                    {/* Submit Button */}
                                    <div className="w-100 d-flex flex-column gap-3">
                                        {isLoading ? (
                                            <button className='btn btn-purple-glow w-100 py-3 fw-bold' type='button'>
                                                <i className="fa-solid fa-spinner fa-spin me-2"></i>Verifying...
                                            </button>
                                        ) : (
                                            <button className='btn btn-purple-glow w-100 py-3 fw-bold' type='submit'>
                                                Establish Enterprise Hub
                                            </button>
                                        )}
                                        <div className="mt-2">
                                            <Link className="text-secondary text-decoration-none sm-text hover-cyan" to={"/registeremployee"}>Register as a Job Seeker instead <i className="fa-solid fa-arrow-right ms-1"></i></Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
}
