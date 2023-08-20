import { Alert, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import toast from "react-hot-toast";
import FormInputField from "../form/FormInputField";
import { Form } from "react-bootstrap";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import useAuthUser from "@/hooks/useAuthUser";
import { useState } from "react";
import { BadRequestError, ConflictError } from "@/network/http-errors";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { requiredStringSchema, usernameSchema, emailSchema, passwordSchema } from "@/utils/validation";
import SocialSignInSection from "./SocialSignInSection";

type SingUpFormData = yup.InferType<typeof validationShema>;

interface SignUpModalProps {
    onDismiss: () => void,
    onLoginClicked: () => void,
}

const validationShema = yup.object({
    username: usernameSchema.required("Required"),
    email: emailSchema.required("Required"),
    password: passwordSchema.required("Required"),
})

export default function SignUpModal({ onDismiss, onLoginClicked }: SignUpModalProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SingUpFormData>({
        resolver: yupResolver(validationShema),
    });
    const [errorText, setErrorText] = useState<string | null>(null);
    const { mutateUser } = useAuthUser();

    async function onSubmit(credentials: SingUpFormData) {
        try {
            setErrorText(null);
            const newUser = await UsersApi.sinUp(credentials);
            mutateUser(newUser);
            onDismiss();
            toast.success("registered!");
        } catch (error) {
            if (error instanceof ConflictError || error instanceof BadRequestError) {
                setErrorText(error.message);
            } else {
                console.log(error);
                alert(error);
            }
        }
    }
    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">{errorText}</Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register("username")}
                        label="Username"
                        placeholder="username"
                        error={errors.username}
                    />
                    <FormInputField
                        register={register("email")}
                        label="Email"
                        placeholder="email"
                        type="email"
                        error={errors.email}
                    />
                    <PasswordInputField
                        register={register("password")}
                        label="Password"
                        error={errors.password}
                    />
                    <LoadingButton type="submit" isLoading={isSubmitting} className="w-100">Sign up</LoadingButton>
                </Form>
                <hr />
                <SocialSignInSection />
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Already have an account?
                    <Button variant="link" onClick={onLoginClicked}>Login </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
}