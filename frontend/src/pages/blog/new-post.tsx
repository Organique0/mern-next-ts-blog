import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as BlogApi from "@/network/api/blog";

interface CreatePostFormData {
    slug: string,
    title: string,
    summary: string,
    body: string,
}


export default function CreateBlogPostPage() {
    const { register, handleSubmit } = useForm<CreatePostFormData>();

    async function onSubmit(input: CreatePostFormData) {
        try {
            await BlogApi.createBlogPost(input);
            alert("Post created");
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    return (
        <div>
            <h1 className="my-4">Create a post</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="title-input">
                    <Form.Label>Post title</Form.Label>
                    <Form.Control placeholder="Post title" {...register("title")} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="slug-input">
                    <Form.Label>Post slug</Form.Label>
                    <Form.Control placeholder="Post slug" {...register("slug")} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="summary-input">
                    <Form.Label>Post summary</Form.Label>
                    <Form.Control placeholder="Post summary" as="textarea" {...register("summary")} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="body-input">
                    <Form.Label>Post body</Form.Label>
                    <Form.Control placeholder="Post body" as="textarea" {...register("body")} />
                </Form.Group>
                <Button type="submit">Create post</Button>
            </Form>
        </div>
    )
}