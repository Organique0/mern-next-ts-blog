import { Comment } from "@/models/comment";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as BlogApi from "@/network/api/blog";
import { Button, Form } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import LoadingButton from "../LoadingButton";
import { useEffect } from "react";

//"i think its clear that it just does not work"
const validationSchema = yup.object({
    text: yup.string(),
});

type UpdateCommentInput = yup.InferType<typeof validationSchema>;

interface EditCommentBoxProps {
    comment: Comment;
    onCommentUpdated: (updatedComment: Comment) => void,
    onCancel: () => void,
}

export default function EditCommentBox({ comment, onCancel, onCommentUpdated }: EditCommentBoxProps) {
    const { register, handleSubmit, formState: { isSubmitting }, setFocus } = useForm<UpdateCommentInput>({
        defaultValues: { text: comment.text },
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit({ text }: UpdateCommentInput) {
        if (!text) return;

        try {
            const updatedComment = await BlogApi.updateComment(comment._id, text);
            onCommentUpdated(updatedComment);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setFocus("text");
    }, [setFocus]);

    return (
        <div className="mt-2">
            <div className="mb-1">
                Edit comment
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register("text")}
                    as="textarea"
                    maxLength={500}
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>Submit</LoadingButton>
                <Button onClick={onCancel} className="ms-2" variant="outline-secondary">Cancel</Button>
            </Form>
        </div>
    )
}