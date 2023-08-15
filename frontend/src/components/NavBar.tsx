import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { MdEditSquare } from "react-icons/md";
import logo from "@/assets/images/main-image.png";
import Image from "next/image";
import style from "@/styles/Navbar.module.css"

export default function NavBar() {
    const router = useRouter();
    return (
        <Navbar variant="dark" expand="md" collapseOnSelect bg="body" sticky="top">
            <Container className="mt-2">
                <Navbar.Brand as={Link} href="/" className="d-flex gap-2 p-0">
                    <Image src={logo} alt="mainLogo" width={50} height={50} />
                    <span className={style.logoText}>Blog App</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar" style={{ paddingTop: 2, paddingLeft: 25 }}>
                    <Nav>
                        <Nav.Link href="/" as={Link} active={router.pathname === "/"}>Home</Nav.Link>
                        <Nav.Link href="/blog" as={Link} active={router.pathname === "blog"}>Blogs</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Nav.Link href="/blog/new-post" as={Link} className="link-secondary d-flex align-items-center gap-2"><MdEditSquare /> Create a post</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}