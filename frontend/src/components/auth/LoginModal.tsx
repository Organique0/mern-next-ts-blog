import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import toast from "react-hot-toast";
import { Button, Form, Modal } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";

interface LoginFormData {
    username: string,
    password: string,
}

interface LoginModalProps {
    onDismiss: () => void,
    onSignupClicked: () => void,
    onForgotPasswordClicked: () => void,

}

export default function LoginModal({ onDismiss, onSignupClicked, onForgotPasswordClicked }: LoginModalProps) {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

    async function onSubmit(credentials: LoginFormData) {
        try {
            const user = await UsersApi.login(credentials);
            toast.success("logged in");
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error); // Print the error message
            } else {
                console.log("An error occurred:", error.message); // Fallback message
            }
        }
    }
    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register("username")}
                        label="Username"
                        placeholder="Username"
                        error={errors.username}
                    />
                    <PasswordInputField
                        register={register("password")}
                        label="Password"
                        placeholder="Password"
                        error={errors.password}
                    />
                    <Button variant="link" onClick={onForgotPasswordClicked} className="d-block ms-auto mt-n2 mb-3 small">
                        Forgot password
                    </Button>
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-100"
                    >
                        Login
                    </LoadingButton>
                </Form>
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Don&apos;t have an account yet?
                    <Button variant="link">Sign up </Button>
                </div>
            </Modal.Body>

        </Modal>
    )
}