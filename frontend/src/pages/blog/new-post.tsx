import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as BlogApi from "@/network/api/blog";
import FormInputField from "@/components/form/FormInputField";
import MarkdownEditor from "@/components/form/MarkdownEditor";
import { generateSlug } from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";

interface CreatePostFormData {
    slug: string,
    title: string,
    summary: string,
    body: string,
}


export default function CreateBlogPostPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, getValues, } = useForm<CreatePostFormData>();

    async function onSubmit(input: CreatePostFormData) {
        try {
            await BlogApi.createBlogPost(input);
            alert("Post created");
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    function generateSlugFromTitle() {
        if (getValues("slug")) return;
        const slug = generateSlug(getValues("title"));
        setValue("slug", slug, { shouldValidate: true })
    }

    return (
        <div>
            <h1 className="my-4">Create a post</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    label="Post title"
                    register={register("title", { required: "Required" })}
                    placeholder="Post title"
                    maxLength={100}
                    error={errors.title}
                    onBlur={generateSlugFromTitle}
                />
                <FormInputField
                    label="Post slug"
                    register={register("slug", { required: "Required" })}
                    placeholder="Post slug"
                    maxLength={100}
                    error={errors.slug}
                />
                <FormInputField
                    label="Post summary"
                    register={register("summary", { required: "Required" })}
                    placeholder="Post summary"
                    maxLength={300}
                    as="textarea"
                    error={errors.summary}
                />
                <MarkdownEditor
                    label="Post body"
                    register={register("body", { required: "Required" })}
                    error={errors.body}
                    watch={watch}
                    setValue={setValue}
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>Create post</LoadingButton>
            </Form>
        </div>
    )
}