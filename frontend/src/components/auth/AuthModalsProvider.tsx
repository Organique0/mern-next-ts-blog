import { ReactNode, createContext, useState } from "react"
import ResetPasswordModal from "./ResetPasswordModal";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

interface AuthModalsProviderProps {
    children: ReactNode,
}

interface AuthModalsContext {
    showLoginModal: () => void,
    showSignupModal: () => void,
    showResetPasswordModal: () => void,
}

export const AuthModalsContext = createContext<AuthModalsContext>({
    showLoginModal: () => { throw Error("AuthModalsContext not implemented") },
    showSignupModal: () => { throw Error("AuthModalsContext not implemented") },
    showResetPasswordModal: () => { throw Error("AuthModalsContext not implemented") },
});

export default function AuthModalsProvider({ children }: AuthModalsProviderProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showResetPasswordModal, setshowResetPasswordModal] = useState(false);

    const [value] = useState({
        showLoginModal: () => setShowLoginModal(true),
        showSignupModal: () => setShowSignupModal(true),
        showResetPasswordModal: () => setshowResetPasswordModal(true),
    });

    return (
        <AuthModalsContext.Provider value={value}>
            {children}
            {showLoginModal &&
                <LoginModal
                    onDismiss={() => setShowLoginModal(false)}
                    onForgotPasswordClicked={() => {
                        setShowLoginModal(false);
                        setshowResetPasswordModal(true);
                    }}
                    onSignupClicked={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                    }}
                />
            }
            {showSignupModal &&
                <SignUpModal
                    onDismiss={() => setShowSignupModal(false)}
                    onLoginClicked={() => {
                        setShowLoginModal(true);
                        setShowSignupModal(false);
                    }}

                />
            }
            {showResetPasswordModal &&
                <ResetPasswordModal
                    onDismiss={() => setshowResetPasswordModal(false)}
                    onSignUpClicked={() => {
                        setshowResetPasswordModal(false);
                        setShowSignupModal(true);
                    }}
                />
            }
        </AuthModalsContext.Provider>
    )
}