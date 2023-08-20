import { Alert, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import toast from "react-hot-toast";
import FormInputField from "../form/FormInputField";
import { Form } from "react-bootstrap";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import useAuthUser from "@/hooks/useAuthUser";
import useCountdown from "@/hooks/useCountdown";
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
    verificationCode: requiredStringSchema,
})

export default function SignUpModal({ onDismiss, onLoginClicked }: SignUpModalProps) {
    const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm<SingUpFormData>({
        resolver: yupResolver(validationShema),
    });

    const [verCodeReqPending, setVerCodeReqPending] = useState(false);
    const [showVerCodeSentText, setShowVerCodeSentText] = useState(false);
    const { secondsLeft: CooldownSecondsLeft, start: startCooldown } = useCountdown();

    const [errorText, setErrorText] = useState<string | null>(null);
    const { mutateUser } = useAuthUser();

    async function onSubmit(credentials: SingUpFormData) {
        try {
            setErrorText(null);
            setShowVerCodeSentText(false);
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

    async function requestVerificationCode() {
        const validEmail = await trigger("email");
        if (!validEmail) return;
        const emailInput = getValues("email");
        setErrorText(null);
        setShowVerCodeSentText(false);
        setVerCodeReqPending(true);
        startCooldown(60);

        try {
            console.log("sending");
            await UsersApi.requestEmailVerificationCode(emailInput);
            console.log("send");
            setShowVerCodeSentText(true);
        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            } else {
                console.error(error);
            }
        } finally {
            setVerCodeReqPending(false);
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
                {showVerCodeSentText &&
                    <Alert>
                        Verification code has been send to your email address
                    </Alert>

                }
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        className="rounded"
                        register={register("username")}
                        label="Username"
                        placeholder="username"
                        error={errors.username}
                    />
                    <FormInputField
                        className="rounded"
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
                    <FormInputField
                        register={register("verificationCode")}
                        label="Verification code"
                        placeholder="Verification code"
                        type="number"
                        error={errors.verificationCode}
                        inputGroupElement={
                            <Button
                                id="send-email-verification-button"
                                disabled={verCodeReqPending || CooldownSecondsLeft > 0}
                                onClick={requestVerificationCode}
                                variant="secondary"
                                className="border-white"
                            >
                                Send code
                                {CooldownSecondsLeft > 0 && ` (${CooldownSecondsLeft})`}
                            </Button>
                        }
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