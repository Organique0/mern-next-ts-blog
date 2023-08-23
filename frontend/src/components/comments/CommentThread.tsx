import { Comment as CommentModel } from "@/models/comment";
import { useState } from "react";
import * as BlogApi from "@/network/api/blog";
import Comment from "./Comment";
import { Button, Spinner } from "react-bootstrap";

interface CommentThreadProps {
    comment: CommentModel,
    onCommentUpdated: (updatedComment: CommentModel) => void,
    onCommentDeleted: (comment: CommentModel) => void,
}
export default function CommentThread({ comment, onCommentDeleted, onCommentUpdated }: CommentThreadProps) {
    const [replies, setReplies] = useState<CommentModel[]>([]);
    const [localReplies, setLocalReplies] = useState<CommentModel[]>([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesLoadingIsError, setRepliesLoadingIsError] = useState(false);
    const [repliesPaginationEnd, setRepliesPaginationEnd] = useState<boolean>();

    async function loadNextReplies() {
        const continueAfterId = replies[replies.length - 1]?._id;
        try {
            setRepliesLoading(true);
            setRepliesLoadingIsError(false);
            const response = BlogApi.getRepliesForComment(comment._id, continueAfterId);
            setReplies([...replies, ...(await response).comments])
            setRepliesPaginationEnd((await response).endOfPaginationReach);
            setLocalReplies([]);
        } catch (error) {
            console.error(error);
            setRepliesLoadingIsError(true);
        } finally {
            setRepliesLoading(false);
        }
    }

    function handleReplyCreated(reply: CommentModel) {
        setLocalReplies([...localReplies, reply]);
    }

    function handleRemoteReplyDeleted(deletedReply: CommentModel) {
        const updated = replies.filter(reply => reply._id !== deletedReply._id);
        setReplies(updated);
    }

    function handleLocalReplyDeleted(deletedReply: CommentModel) {
        const updated = localReplies.filter(reply => reply._id !== deletedReply._id);
        setLocalReplies(updated);
    }

    function handleRemoteReplyUpdated(updatedReply: CommentModel) {
        const update = replies.map(existing => existing._id === updatedReply._id ? updatedReply : existing);
        setReplies(update);
    }

    function handleLocalReplyUpdated(updatedReply: CommentModel) {
        const update = localReplies.map(existing => existing._id === updatedReply._id ? updatedReply : existing);
        setLocalReplies(update);
    }



    const showLoadRepliesButton = !!comment.repliesCount && !repliesLoading && !repliesPaginationEnd;

    return (
        <div>
            <Comment
                comment={comment}
                onCommentDeleted={onCommentDeleted}
                onCommentUpdate={onCommentUpdated}
                onReplyCreated={handleReplyCreated}
            />
            <Replies
                replies={replies}
                onReplyCreated={handleReplyCreated}
                onReplyDeleted={handleRemoteReplyDeleted}
                onReplyUpdated={handleRemoteReplyUpdated}
            />
            <div className="mt-2 text-center">
                {repliesLoading && <Spinner animation="border" />}
                {repliesLoadingIsError && <p>Replies could not be loaded</p>}
                {showLoadRepliesButton &&
                    <Button variant="outline-primary" onClick={loadNextReplies}>
                        {repliesPaginationEnd === undefined
                            ? `Show ${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`
                            : "Show more replies"
                        }
                    </Button>
                }
            </div>
            <Replies
                replies={localReplies}
                onReplyCreated={handleReplyCreated}
                onReplyDeleted={handleLocalReplyDeleted}
                onReplyUpdated={handleLocalReplyUpdated}
            />
        </div>
    )
}

interface RepliesProps {
    replies: CommentModel[],
    onReplyCreated: (reply: CommentModel) => void,
    onReplyUpdated: (updatedReply: CommentModel) => void,
    onReplyDeleted: (reply: CommentModel) => void,
}

function Replies({ replies, onReplyCreated, onReplyDeleted, onReplyUpdated }: RepliesProps) {
    return (
        <div className="ms-5">
            {replies.map(reply => (
                <Comment
                    comment={reply}
                    key={reply._id}
                    onReplyCreated={onReplyCreated}
                    onCommentDeleted={onReplyDeleted}
                    onCommentUpdate={onReplyUpdated}
                />
            ))}
        </div>
    )
}