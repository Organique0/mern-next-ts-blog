import useAuthUser from "@/hooks/useAuthUser";
import useCountdown from "@/hooks/useCountdown";
import { emailSchema, passwordSchema, requiredStringSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import * as UsersApi from "@/network/api/users";
import toast from "react-hot-toast";
import { BadRequestError, ConflictError, NotFoundError } from "@/network/http-errors";
import { Modal, Alert, Form, Button } from "react-bootstrap";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import SocialSignInSection from "./SocialSignInSection";


const validationSchema = yup.object({
    email: emailSchema.required("Required"),
    password: passwordSchema.required("Required"),
    verificationCode: requiredStringSchema,
});

type ResetPasswordFormData = yup.InferType<typeof validationSchema>;

interface ResetPasswordResetProps {
    onDismiss: () => void,
    onSignUpClicked: () => void,
}

export default function ResetPasswordModal({ onDismiss, onSignUpClicked }: ResetPasswordResetProps) {
    const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(validationSchema),
    });

    const [verCodeReqPending, setVerCodeReqPending] = useState(false);
    const [showVerCodeSentText, setShowVerCodeSentText] = useState(false);
    const { secondsLeft: CooldownSecondsLeft, start: startCooldown } = useCountdown();

    const [errorText, setErrorText] = useState<string | null>(null);
    const { mutateUser } = useAuthUser();

    async function onSubmit(credentials: ResetPasswordFormData) {
        try {
            setErrorText(null);
            setShowVerCodeSentText(false);
            const user = await UsersApi.resetPassword(credentials);
            mutateUser(user);
            onDismiss();
            toast.success("Password reset successfull");
        } catch (error) {
            if (error instanceof ConflictError || error instanceof BadRequestError) {
                setErrorText(error.message);
            } else {
                console.log(error);
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
            await UsersApi.requestPassResetCode(emailInput);
            setShowVerCodeSentText(true);
        } catch (error) {
            if (error instanceof NotFoundError) {
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
                <Modal.Title>Reset password</Modal.Title>
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
                        register={register("email")}
                        label="Email"
                        placeholder="email"
                        type="email"
                        error={errors.email}
                    />
                    <PasswordInputField
                        register={register("password")}
                        label="New password"
                        error={errors.password}
                        placeholder="New password"
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
                    <LoadingButton type="submit" isLoading={isSubmitting} className="w-100">Log in</LoadingButton>
                </Form>
                <hr />
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Don&apos;t have an account yet?
                    <Button variant="link" onClick={onSignUpClicked}>Sign up </Button>
                </div>

            </Modal.Body>
        </Modal>
    )
}