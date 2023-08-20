import { BlogPost } from "@/models/blogPost"
import { GetServerSideProps } from "next"
import * as BlogApi from "@/network/api/blog";
import { NotFoundError } from "@/network/http-errors";
import * as yup from "yup";
import { requiredFileSchema, requiredStringSchema, slugSchema } from "@/utils/validation";
import useAuthUser from "@/hooks/useAuthUser";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Spinner } from "react-bootstrap";
import FormInputField from "@/components/form/FormInputField";
import MarkdownEditor from "@/components/form/MarkdownEditor";
import LoadingButton from "@/components/LoadingButton";
import { generateSlug } from "@/utils/utils";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import useWarnUnsavedChanges from "@/hooks/useWarnUnsavedChanges";
import { AxiosError } from "axios";

export const getServerSideProps: GetServerSideProps<EditBlogPostPageProps> = async ({ params }) => {
    try {
        const slug = params?.slug?.toString();
        if (!slug) throw Error("slug is undefined");

        const post = await BlogApi.getBlogPostBySlug(slug);
        return { props: { post } };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { notFound: true }
        } else {
            throw error;
        }
    }
}

interface EditBlogPostPageProps {
    post: BlogPost,
}

const validationSchema = yup.object({
    slug: slugSchema.required("Required"),
    title: requiredStringSchema,
    summary: requiredStringSchema,
    body: requiredStringSchema,
    featuredImage: yup.mixed<FileList>(),
});

type EditPostFormData = yup.InferType<typeof validationSchema>;

export default function EditBlogPostPage({ post }: EditBlogPostPageProps) {
    const { user, userLoading } = useAuthUser();
    const router = useRouter();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePending, setDeletePending] = useState(false);

    const { register, handleSubmit, setValue, getValues, watch, formState: { errors, isSubmitting, isDirty } } = useForm<EditPostFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            slug: post.slug,
            title: post.title,
            summary: post.summary,
            body: post.body,
        }
    });

    async function onSubmit({ title, slug, summary, featuredImage, body }: EditPostFormData) {
        try {
            await BlogApi.updateBlogPost(post._id, { title, slug, summary, featuredImage: featuredImage?.item(0) || undefined, body });
            toast.success("Blog post updated!");
            await router.push("/blog/" + slug);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    function generateSlugFromTitle() {
        if (getValues("slug")) return;
        const slug = generateSlug(getValues("title"));
        setValue("slug", slug, { shouldValidate: true });
    }

    async function onDeleteConfirm() {
        setShowDeleteDialog(false);
        setDeletePending(true);
        try {
            await BlogApi.deleteBlogPost(post._id);
            toast.success("Blog post deleted!");
            await router.push("/blog");
        } catch (error: any) {
            setDeletePending(false);
            toast.error(error.message);
        }
    }

    useWarnUnsavedChanges(isDirty && !isSubmitting && !deletePending);

    if (userLoading) return <Spinner animation="border" className="d-block m-auto" />

    const userIsAuthorized = (user && user._id === post.author._id) || false;

    if (!userLoading && !userIsAuthorized) {
        return <p>You cannot edit posts from other users</p>
    }


    return (
        <div>
            <h1>Edit post</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    label="Post title"
                    register={register("title")}
                    placeholder="Post title"
                    maxLength={100}
                    error={errors.title}
                    onBlur={generateSlugFromTitle}
                />
                <FormInputField
                    label="Post slug"
                    register={register("slug")}
                    placeholder="Post slug"
                    maxLength={100}
                    error={errors.slug}
                />
                <FormInputField
                    label="Post summary"
                    register={register("summary")}
                    placeholder="Post summary"
                    maxLength={300}
                    as="textarea"
                    error={errors.summary}
                />
                <FormInputField
                    label="Post image"
                    register={register("featuredImage")}
                    type="file"
                    accept="image/png,image/jpeg"
                    error={errors.summary}
                />
                <MarkdownEditor
                    label="Post body"
                    register={register("body")}
                    error={errors.body}
                    watch={watch}
                    setValue={setValue}
                />
                <div className="d-flex justify-content-between">
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={deletePending}
                    >
                        Update post
                    </LoadingButton>
                    <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline-danger"
                        disabled={deletePending}
                    >
                        Delete post
                    </Button>
                </div>
            </Form>
            <ConfirmationModal
                show={showDeleteDialog}
                title="Confirm delete"
                message="Do you really want to delete this post?"
                confirmButtonText="Delete"
                onCancel={() => setShowDeleteDialog(false)}
                onConfirm={onDeleteConfirm}
                variant="danger"
            />
        </div>
    )
}