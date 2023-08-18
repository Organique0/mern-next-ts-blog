import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import toast from "react-hot-toast";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import { useState } from "react";
import { UnauthorizedError } from "@/network/http-errors";
import useAuthUser from "@/hooks/useAuthUser";

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
    const { mutateUser } = useAuthUser();
    const [errorText, setErrorText] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

    async function onSubmit(credentials: LoginFormData) {
        try {
            setErrorText(null);
            const user = await UsersApi.login(credentials);
            mutateUser(user);
            onDismiss();
            toast.success("logged in");
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                setErrorText("invalid credentials");
            } else {

            }
        }
    }
    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">{errorText}</Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register("username", { required: true })}
                        label="Username"
                        placeholder="Username"
                        error={errors.username}
                    />
                    <PasswordInputField
                        register={register("password", { required: true })}
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
                    <Button variant="link" onClick={onSignupClicked}>Sign up </Button>
                </div>
            </Modal.Body>

        </Modal>
    )
}