import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import './RegisterCompany.css';
import companyBanner from '../../assets/company_register.png';

export default function RegisterCompany() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const industries = [
        "Technology & Software",
        "Healthcare & Biotech",
        "Finance & Banking",
        "E-Commerce & Retail",
        "Manufacturing",
        "Education",
        "Telecommunications"
    ];

    const validation = Yup.object({
        name: Yup.string().required("Company name is required").min(3, "Too short").max(50, "Too long"),
        email: Yup.string().required("Email is required").email("Invalid email address"),
        password: Yup.string().required("Password is required").min(8, "Minimum 8 characters"),
        industry: Yup.string().required("Please select an industry")
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            industry: ""
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            setIsLoading(true);
            setError('');
            try {
                // Mock Registration Logic
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const companies = JSON.parse(localStorage.getItem('companies') || '[]');
                if (companies.find(c => c.email === values.email)) {
                    throw new Error("This email is already registered.");
                }

                const newCompany = {
                    id: Date.now(),
                    ...values,
                    role: 'Company'
                };

                companies.push(newCompany);
                localStorage.setItem('companies', JSON.stringify(companies));

                // Add to general users for login
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                users.push({ ...newCompany });
                localStorage.setItem('users', JSON.stringify(users));

                navigate('/login');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="reg-company-page">
            <Header />
            
            <div className="reg-company-container">
                <div className="reg-company-card animate-in">
                    {/* Banner Side */}
                    <div className="reg-company-banner-side">
                        <img src={companyBanner} alt="Enterprise" className="reg-company-img" />
                        <h2 className="fw-bold text-dark">Join the Network</h2>
                        <p className="text-muted">Accelerate your hiring process with AI-driven talent matching.</p>
                    </div>

                    {/* Form Side */}
                    <div className="reg-company-form-side">
                        <h1>Enterprise Registration</h1>
                        <p>Create your corporate account to start posting jobs today.</p>

                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <input 
                                    name="name"
                                    type="text" 
                                    className="modern-reg-input" 
                                    placeholder="Company Name"
                                    {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name && <div className="text-danger small mt-1">{formik.errors.name}</div>}
                            </div>

                            <div className="mb-3">
                                <input 
                                    name="email"
                                    type="email" 
                                    className="modern-reg-input" 
                                    placeholder="Corporate Email"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email && <div className="text-danger small mt-1">{formik.errors.email}</div>}
                            </div>

                            <div className="mb-3">
                                <input 
                                    name="password"
                                    type="password" 
                                    className="modern-reg-input" 
                                    placeholder="Password"
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password && <div className="text-danger small mt-1">{formik.errors.password}</div>}
                            </div>

                            <div className="mb-4">
                                <select 
                                    name="industry"
                                    className="modern-reg-input"
                                    {...formik.getFieldProps('industry')}
                                >
                                    <option value="">Select Industry</option>
                                    {industries.map((ind, i) => <option key={i} value={ind}>{ind}</option>)}
                                </select>
                                {formik.touched.industry && formik.errors.industry && <div className="text-danger small mt-1">{formik.errors.industry}</div>}
                            </div>

                            <button type="submit" className="reg-btn-submit" disabled={isLoading}>
                                {isLoading ? <><i className="fa-solid fa-sync fa-spin me-2"></i> Processing...</> : "Register Company"}
                            </button>

                            <Link to="/registeremployee" className="switch-reg-link">
                                Are you a job seeker? Register here <i className="fa-solid fa-arrow-right ms-1"></i>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
