import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import toast from "react-hot-toast";
import FormInputField from "../form/FormInputField";
import { Form } from "react-bootstrap";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
interface SignUpformData {
    username: string,
    email: string,
    password: string,
}

interface SignUpModalProps {
    onDismiss: () => void,
    onLoginClicked: () => void,
}

export default function SignUpModal({ onDismiss, onLoginClicked }: SignUpModalProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpformData>();

    async function onSubmit(credentials: SignUpformData) {
        try {
            const newUser = await UsersApi.sinUp(credentials);
            console.log(JSON.stringify(newUser));
            toast.success("registered!");
        } catch (error) {
            toast.error(error as string);
            console.log(error);
        }
    }
    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                    <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                        Already have an account?
                        <Button variant="link">Login </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}