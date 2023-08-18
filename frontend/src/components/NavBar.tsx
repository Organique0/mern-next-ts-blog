import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { MdEditSquare } from "react-icons/md";
import logo from "@/assets/images/main-image.png";
import Image from "next/image";
import style from "@/styles/Navbar.module.css"
import useAuthUser from "@/hooks/useAuthUser";
import { useState } from "react";
import LoginModal from "./auth/LoginModal";
import SignUpModal from "./auth/SignUpModal";
import { User } from "@/models/user";
import profilePicPlaceholder from "@/assets/images/profile-pic-placeholder.png";
import { logout } from "@/network/api/users";

export default function NavBar() {
    const { user } = useAuthUser();
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
                    {user ? <LoggedInView user={user} /> : <LoggedOutView />}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

interface LoggedInViewProps {
    user: User,
}

function LoggedInView({ user }: LoggedInViewProps) {
    const { mutateUser } = useAuthUser();

    async function logoutUser() {
        try {
            await logout();
            mutateUser(null);
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    return (
        <Nav className="ms-auto">
            <Nav.Link href="/blog/new-post" as={Link} className="link-secondary d-flex align-items-center gap-2"><MdEditSquare /> Create a post</Nav.Link>
            <Navbar.Text className="ms-md-3">
                Hey, {user.displayName || "User"}!
            </Navbar.Text>
            <NavDropdown
                className={style.accountDropdown}
                title={
                    <Image src={user.profilePicUrl || profilePicPlaceholder} width={40} height={40} alt="user image" className="rounded-circle" />
                }
            >
                {user.username &&
                    <>
                        <NavDropdown.Item as={Link} href={"/users/" + user.username}>
                            Profile
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                    </>
                }
                <NavDropdown.Item onClick={logoutUser}>logout</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    )
}

function LoggedOutView() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    return (
        <>
            <Nav className="ms-auto">
                <Button variant="outline-primary" className="ms-md-2 mt-2 mt-md-0" onClick={() => setShowLoginModal(true)}>
                    Log In
                </Button>
                <Button className="ms-md-2 mt-2 mt-md-0" onClick={() => setShowSignupModal(true)}>
                    Sign up
                </Button>
            </Nav>
            {showLoginModal &&
                <LoginModal
                    onDismiss={() => setShowLoginModal(false)}
                    onForgotPasswordClicked={() => { }}
                    onSignupClicked={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                    }}
                />
            }
            {showSignupModal &&
                <SignUpModal
                    onDismiss={() => setShowSignupModal(false)}
                    onLoginClicked={() => {
                        setShowLoginModal(true);
                        setShowSignupModal(false);
                    }}

                />
            }
        </>
    )
}