import React, { useState } from 'react'; // ✅ import useState
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import "../Login/Login.css";
import "../RegisterEmployee/RegisterEmployee.css";
import loginImage from "../../assets/0002_1_explore-how-the-fast-paced-digital-revol_41pgg1YCT6WgD7h_l4EPKQ_CBbx0yxyRnirBWGDA1nx3g_cover.jpeg";
import techGraphic from "../../assets/ai_tech.png"
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';

export default function Industry() {
    // const navigate = useNavigate();
    // const [submitted, setSubmitted] = useState(false); // ✅ track submission
    const [industryState, setIndustryState] = useState(false);
    const [id, setId] = useState("");
    async function handleIndustry(values) {
        setIndustryState(true);
        console.log("FormData being sent:", { name: values.name });

        try {
            // MOCK BACKEND
            await new Promise(resolve => setTimeout(resolve, 500));

            const industries = JSON.parse(localStorage.getItem('industries') || '[]');
            const exists = industries.find(i => i.name.toLowerCase() === values.name.toLowerCase());

            if (exists) {
                setId(exists.id);
                alert(`Industry already exists. ID: ${exists.id}`);
                return;
            }

            const newIndustry = {
                id: Date.now().toString(),
                name: values.name
            };

            industries.push(newIndustry);
            localStorage.setItem('industries', JSON.stringify(industries));

            console.log("Industry Added:", newIndustry);
            setId(newIndustry.id);
            alert(`Industry Added! ID: ${newIndustry.id}`);
            // window.location.reload(); // No need to reload in mock mode usually, but keeping flow
        } catch (error) {
            console.log("Mock Error:", error);
            alert("Something went wrong.");
        }
    }
    // get industry
    async function getIndustry(values) {
        setIndustryState(false);
        console.log("FormData being sent:", { name: values.name });

        try {
            // MOCK BACKEND
            await new Promise(resolve => setTimeout(resolve, 500));

            // Seed Mock Data if empty
            let industries = JSON.parse(localStorage.getItem('industries') || '[]');
            if (industries.length === 0) {
                industries = [
                    { id: '1', name: 'IT' },
                    { id: '2', name: 'Finance' },
                    { id: '3', name: 'Healthcare' }
                ];
                localStorage.setItem('industries', JSON.stringify(industries));
            }

            console.log("Mock Industries:", industries);

            const found = industries.find(i => i.name.toLowerCase() === values.name.toLowerCase());

            if (found) {
                setId(found.id);
                setIndustryState(false);
            } else {
                setIndustryState(true);
                handleIndustry(values); // Corrected function call
            }
        } catch (error) {
            console.log("Mock Error:", error);
            alert("Something went wrong.");
        }
    }
    const validation = Yup.object({
        name: Yup.string()
            .required("Industry name is required")
            .min(2, "Minimum length is 2")
            .max(15, "Maximum length is 15"),
    });
    // define the sybmit state
    function submitHandler(values) {
        if (industryState === false) {
            return getIndustry(values);
        } else {
            return handleIndustry(values);
        }
    }
    const formik = useFormik({
        initialValues: { name: "" },
        validationSchema: validation,
        onSubmit: submitHandler,
    });


    return (
            <div className="container-fluid p-0 login-grand-wrapper">
                <Header />
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center py-5 hero-reg">
                        <div className="col-lg-6 mb-5 mb-lg-0 text-center d-none d-lg-block">
                            <div className="login-image-container position-relative w-75 mx-auto">
                                <div className="glow-effect"></div>
                                <img className="img-fluid rounded-4 shadow-lg position-relative z-2" src={techGraphic} alt="Industry Database" />
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="login-glass-panel p-5 rounded-4 shadow-lg text-center">
                                <h1 className="text-white fw-bold mb-2">Industry <span className="text-cyan">Resolver</span></h1>
                                <p className="text-secondary mb-4">Query the NextHire sector database to retrieve your unique enterprise identifier.</p>

                                <form
                                    className='w-100 d-flex flex-column align-items-center justify-content-center'
                                    onSubmit={formik.handleSubmit}
                                >
                                    <div className="w-100 mb-4">
                                        <input
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.name}
                                            className="glass-input w-100"
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder='Sector Name (e.g. IT, Finance)'
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <div className="text-danger small mt-2 text-start ps-2">{formik.errors.name}</div>
                                        )}
                                    </div>

                                    <button className="btn btn-cyan-glow w-100 py-3 fw-bold mb-4" type='submit'>
                                        <i className="fa-solid fa-microchip me-2"></i>Execute Sector Discovery
                                    </button>

                                    {id && (
                                        <div className="w-100 p-3 bg-dark border border-cyan rounded-3 text-start">
                                            <p className="text-cyan small fw-bold mb-1"><i className="fa-solid fa-fingerprint me-2"></i>Assigned UUID:</p>
                                            <p className="text-white mono-text m-0 fs-5" style={{fontFamily: 'monospace', letterSpacing: '1px'}}>{id}</p>
                                            <p className="text-secondary small mt-2">Copy this ID to your registration portal.</p>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
}
