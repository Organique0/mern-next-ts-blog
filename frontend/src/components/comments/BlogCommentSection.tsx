import { Comment as CommentModel } from "@/models/comment";
import { useCallback, useEffect, useState } from "react"
import * as BlogApi from "@/network/api/blog";
import CreateCommentBox from "./CreateCommentBox";
import Comment from "./Comment";
import { Button, Spinner } from "react-bootstrap";
import CommentThread from "./CommentThread";
interface BlogCommentSectionProps {
    blogPostId: string,
}

export default function BlogCommentSection({ blogPostId }: BlogCommentSectionProps) {
    return (
        <CommentSection blogPostId={blogPostId} key={blogPostId} />
    )
};

function CommentSection({ blogPostId }: BlogCommentSectionProps) {
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsLoadingIsError, setCommentsLoadingIsError] = useState(false);
    const [commentsPaginationEnd, setCommentsPaginationEnd] = useState<boolean>();

    const loadNextCommetsPage = useCallback(async (continueAfterId?: string) => {
        try {
            setCommentsLoading(true);
            setCommentsLoadingIsError(false);
            const response = await BlogApi.getCommentsForBlogPost(blogPostId, continueAfterId);
            if (!continueAfterId) {
                setComments(response.comments);
            } else {
                setComments(existingComments => [...existingComments, ...response.comments]); //we cannot use comments as a dep. so we need to use the approach
            }
            setCommentsPaginationEnd(response.endOfPaginationReach);
        } catch (error) {
            console.error(error);
            setCommentsLoadingIsError(true);
        } finally {
            setCommentsLoading(false);
        }
    }, [blogPostId]);

    useEffect(() => {
        loadNextCommetsPage();
    }, [loadNextCommetsPage]);

    function handleCommentCreated(newComment: CommentModel) {
        setComments([newComment, ...comments]);
    }

    function handleCommentUpdated(updatedComment: CommentModel) {
        const update = comments.map(comment => comment._id === updatedComment._id ? { ...updatedComment, repliesCount: comment.repliesCount } : comment);
        setComments(update);
    }

    function handleCommentDeleted(deletedComment: CommentModel) {
        const update = comments.filter(comment => comment._id !== deletedComment._id);
        setComments(update);
    }
    return (
        <div>
            <p className="h5">Comments</p>
            <CreateCommentBox blogPostId={blogPostId} title="Write a comment" onCommentCreated={handleCommentCreated} />
            {comments.map(comment => (
                <CommentThread comment={comment} key={comment._id} onCommentDeleted={handleCommentDeleted} onCommentUpdated={handleCommentUpdated} />
            ))}
            <div className="mt-2 text-center">
                {commentsPaginationEnd && comments.length === 0 &&
                    <p>No comments yet</p>
                }
                {commentsLoading && <Spinner animation="border" />}
                {commentsLoadingIsError && <p>There was a problem loading comments</p>}
                {!commentsLoading && !commentsPaginationEnd &&
                    <Button variant="outline-secondary" onClick={() => loadNextCommetsPage(comments[comments.length - 1]?._id)}>Show more comments</Button>
                }
            </div>
        </div>
    )
}