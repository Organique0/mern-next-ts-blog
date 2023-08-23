import { Comment as CommentModel } from "@/models/comment"
import UserProfileLink from "../UserProfileLink"
import { formatRelativeDate } from "@/utils/utils"
import EditCommentBox from "./EditCommentBox"
import useAuthUser from "@/hooks/useAuthUser"
import { useContext, useState } from "react"
import { AuthModalsContext } from "../auth/AuthModalsProvider"
import { Button } from "react-bootstrap"
import CreateCommentBox from "./CreateCommentBox"
import { NotFoundError } from "@/network/http-errors"
import * as BlogApi from "@/network/api/blog";

interface CommentProps {
    comment: CommentModel,
    onReplyCreated: (reply: CommentModel) => void,
    onCommentUpdate: (updatedComment: CommentModel) => void,
    onCommentDeleted: (comment: CommentModel) => void,

}

export default function Comment({ comment, onCommentDeleted, onCommentUpdate, onReplyCreated }: CommentProps) {
    const { user } = useAuthUser();

    const authModalsContext = useContext(AuthModalsContext);

    const [showEditBox, setShowEditBox] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    function handleCommentUpdated(updatedComment: CommentModel) {
        onCommentUpdate(updatedComment);
        setShowEditBox(false);
    }

    function handleReplyCreated(newReply: CommentModel) {
        onReplyCreated(newReply);
        setShowReplyBox(false);
    }

    function handleReplyClick() {
        if (user) {
            setShowReplyBox(true);
        } else {
            authModalsContext.showLoginModal();
        }
    }

    function handleEditClick() {
        setShowEditBox(true);
        setShowDeleteConfirm(false);
    }

    return (
        <div>
            <hr />
            {showEditBox ?
                <EditCommentBox comment={comment} onCommentUpdated={handleCommentUpdated} onCancel={(() => setShowEditBox(false))} /> :
                <CommentLayout
                    comment={comment}
                    onDeleteClicked={() => setShowDeleteConfirm(true)}
                    onEditClicked={handleEditClick}
                    onReplyClicked={handleReplyClick} />
            }
            {showReplyBox &&
                <CreateCommentBox
                    blogPostId={comment.blogPostId}
                    title="Your reply"
                    onCommentCreated={handleReplyCreated}
                    parentCommentId={comment.parentCommentId ?? comment._id}
                    showCancel
                    onCancel={() => setShowReplyBox(false)}
                    defaultText={comment.parentCommentId ? `@${comment.author.username}` : ""}
                />
            }
            {showDeleteConfirm &&
                <DeleteConfirmation comment={comment} onCommentDeleted={onCommentDeleted} onCancel={() => setShowDeleteConfirm(false)} />
            }
        </div>
    )
}

interface CommentLayoutProps {
    comment: CommentModel,
    onReplyClicked: () => void,
    onEditClicked: () => void,
    onDeleteClicked: () => void,
}

function CommentLayout({ comment, onDeleteClicked, onEditClicked, onReplyClicked }: CommentLayoutProps) {
    const { user } = useAuthUser();
    const loggedInUserIsAuthor = (user && (user._id === comment.author._id)) || false;
    return (
        <div>
            <div className="mt-2">{comment.text}</div>
            <div className="d-flex gap-2 align-items-center">
                <UserProfileLink user={comment.author} />
                {formatRelativeDate(comment.createdAt)}
                {comment.updatedAt > comment.createdAt && <span>(edited)</span>}
            </div>
            <div className="mt-1 d-flex gap-2">
                <Button variant="link" className="small" onClick={onReplyClicked}>Reply</Button>
                {loggedInUserIsAuthor &&
                    <>
                        <Button variant="link" className="small" onClick={onEditClicked}>Edit</Button>
                        <Button variant="link" className="small" onClick={onDeleteClicked}>Delete</Button>

                    </>
                }
            </div>
        </div>
    )
}

interface DeleteConfirmationProps {
    comment: CommentModel,
    onCommentDeleted: (comment: CommentModel) => void,
    onCancel: () => void,
}

function DeleteConfirmation({ comment, onCommentDeleted, onCancel }: DeleteConfirmationProps) {
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    async function DeleteComment() {
        try {
            setDeleteInProgress(true);
            await BlogApi.deleteComment(comment._id);
            onCommentDeleted(comment);
        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundError) {
                onCommentDeleted(comment);
            } else {
                console.log(error);
            }
        } finally {
            setDeleteInProgress(false);
        }
    }

    return (
        <div>
            <p className="text-danger">Are you sure you want to delete this comment</p>
            <Button variant="danger" onClick={DeleteComment} disabled={deleteInProgress}>Delete</Button>
            <Button variant="outline-danger" onClick={onCancel} className="ms-2">Cancel</Button>
        </div>
    )
}