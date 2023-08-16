import BlogPostEntry from "@/components/BlogPostEntry";
import { BlogPost } from "@/models/blogPost";
import { Col, Row } from "react-bootstrap";
import styles from "@/styles/BlogPostGrid.module.css";

interface BlogPostGrid {
    posts: BlogPost[]
}

export default function BlogPostGrid({ posts }: BlogPostGrid) {
    return (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {posts.map((post) => (
                <Col key={post._id}>
                    <BlogPostEntry post={post} className={styles.entry} />
                </Col>
            ))}
        </Row>
    )
}