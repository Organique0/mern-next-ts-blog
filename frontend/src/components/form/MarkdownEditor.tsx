import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
import { FieldError, UseFormRegisterReturn, UseFormSetValue, UseFormWatch } from "react-hook-form";
import ReactMarkdown from "react-markdown";

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

interface MarkdownEditorProps {
    register: UseFormRegisterReturn,
    label?: string,
    error?: FieldError,
    watch: UseFormWatch<any>,
    setValue: UseFormSetValue<any>,
    editorHeight?: number,
}
export default function MarkdownEditor({ register, label, error, watch, setValue, editorHeight = 600 }: MarkdownEditorProps) {
    return (
        <Form.Group className="mb-3">
            {label && <Form.Label htmlFor={register.name + "-input_md"}>{label}</Form.Label>}
            <MdEditor
                {...register}
                id={register.name + "-input"}
                renderHTML={text => <ReactMarkdown>{text}</ReactMarkdown>}
                onChange={({ text }) => setValue(register.name, text, { shouldValidate: true, shouldDirty: true, })}
                value={watch(register.name)}
                className={error ? "is-invalid" : ""}
                style={{ height: editorHeight }}
                placeholder="Here you can write markdown code that will be translated to html"
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    )
}