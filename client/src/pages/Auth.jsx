import React from "react"
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";

function Auth() {
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    const handleGoogleAuth = async () => {
        setIsLoggingIn(true);
        if (!auth || !provider) {
            console.warn("Firebase not configured. Simulating Google Login...");
            setTimeout(() => {
                setIsLoggingIn(false);
                navigate("/");
            }, 1000);
            return;
        }
        try {
            const response = await signInWithPopup(auth, provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true })
            console.log(result.data)
            setIsLoggingIn(false);
            navigate("/");
        }
        catch (error) {
            console.error("Google sign in error:", error);
            setIsLoggingIn(false);
        }
    }

    return (
        <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.55 }}
                className='w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200'>
                <div className='flex items-center justify-center gap-3 mb-6'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={18} />
                    </div>
                    <h2 className='font-semibold text-lg'>HIREX.AI</h2>
                </div>
                <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                    Continue With{" "}
                    <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                        <IoSparkles size={16} />
                        AI Smart Interview
                    </span>
                </h1>
                <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                    Sign in to start AI-powered mock interview, track your progress, and unlock
                    detailed performance insights.
                </p>
                <motion.button
                    onClick={handleGoogleAuth}
                    disabled={isLoggingIn}
                    whileHover={isLoggingIn ? {} : { opacity: 0.9, scale: 1.03 }}
                    whileTap={isLoggingIn ? {} : { opacity: 1, scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md transition-all ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isLoggingIn ? (
                        <span>Connecting...</span>
                    ) : (
                        <>
                            <FcGoogle size={20} />
                            Continue with Google
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Auth