import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import "./RegisterState.css"
import { Link } from 'react-router-dom'
import registerGraphic from '../../assets/ai_register.png'

export default function RegisterState() {
    return (
        <>
            <div className="container-fluid p-0 login-grand-wrapper">
                <Header />
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center py-5 hero-reg">
                        <div className="col-lg-6 mb-5 mb-lg-0 text-center">
                            <div className="login-image-container position-relative w-75 mx-auto">
                                <div className="glow-effect"></div>
                                <img className="img-fluid rounded-4 shadow-lg position-relative z-2" src={registerGraphic} alt="Secure Gateway" />
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="login-glass-panel p-5 rounded-4 shadow-lg text-center">
                                <h1 className="text-white fw-bold mb-4">Initialize <span className="text-cyan">Account</span></h1>
                                <p className="text-secondary mb-5">Select your entity classification to gain access to the NextHire network.</p>

                                <div className="d-flex flex-column gap-4">
                                    <Link className='btn btn-cyan-glow fw-bold py-3 fs-5' to={"/registeremployee"}>
                                        <i className="fa-solid fa-user-astronaut me-3"></i>Sign Up As Talent
                                    </Link>
                                    <Link className='btn btn-purple-glow fw-bold py-3 fs-5' to={"/registeremployer"}>
                                        <i className="fa-solid fa-building-shield me-3"></i>Sign Up As Enterprise
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
