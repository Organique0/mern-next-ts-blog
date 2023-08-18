import { User } from "@/models/user"
import { GetServerSideProps } from "next"
import * as UsersApi from "@/network/api/users";
import * as BlogApi from "@/network/api/blog";
import { useState } from "react";
import useAuthUser from "@/hooks/useAuthUser";
import Head from "next/head";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Image from "next/image";
import profilePicPlaceholder from "@/assets/images/profile-pic-placeholder.png";
import styles from "@/styles/UserProfilePage.module.css";
import { formatDate } from "@/utils/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormInputField from "@/components/form/FormInputField";
import LoadingButton from "@/components/LoadingButton";
import useSWR from "swr";
import BlogPostGrid from "@/components/BlogPostGrid";
import { NotFoundError } from "@/network/http-errors";

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async ({ params }) => {
    try {
        const username = params?.username?.toString();
        if (!username) throw Error("username missing");

        const user = await UsersApi.getUserByUsername(username);
        return { props: { user } };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { notFound: true };
        } else {
            throw error;
        }
    }

}

interface UserProfilePageProps {
    user: User,
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
    const { user: loggedInUser, mutateUser: mutateLoggedInUser } = useAuthUser();
    const [profileUser, setProfileUser] = useState(user);
    const profileUserIsLoggedInUser = (loggedInUser && (loggedInUser._id === profileUser._id)) || false;

    function handleUserUpdated(updatedUser: User) {
        mutateLoggedInUser(updatedUser);
        setProfileUser(updatedUser);
    }

    return (
        <>
            <Head>
                <title>{`${profileUser.username} - profile`}</title>
            </Head>
            <div>
                <UserInfoSection user={profileUser} />
                {profileUserIsLoggedInUser &&
                    <>
                        <hr />
                        <UpdateUserProfileSection onUserUpdated={handleUserUpdated} />
                    </>
                }
                <hr />
                <UserBlogPostSection user={profileUser} />
            </div>
        </>
    )
}

interface UserInfoSectionProps {
    user: User;
}

function UserInfoSection({ user: { username, displayName, profilePicUrl, about, createdAt } }: UserInfoSectionProps) {
    return (
        <Row>
            <Col sm="auto">
                <Image
                    src={profilePicUrl || profilePicPlaceholder}
                    width={200}
                    height={200}
                    alt={"Profile picture of user: " + username}
                    priority
                    className={`rounded ${styles.profilePic}`} />
            </Col>
            <Col className="mt-2 mt-sm-0">
                <h1 className={styles.primary}>{displayName}</h1>
                <div><strong className={styles.secondary}>Username: </strong>{username}</div>
                <div><strong className={styles.secondary}>User since: </strong>{formatDate(createdAt)}</div>
                <div className="pre-line"><strong className={styles.secondary}>About me:</strong><br />{about || ""}</div>
            </Col>
        </Row>
    )
}

const validationSchema = yup.object({
    displayName: yup.string(),
    about: yup.string(),
    profileImage: yup.mixed<FileList>(),
});

type UpdateUserProfileFormData = yup.InferType<typeof validationSchema>;

interface UpdateUserProfileSectionProps {
    onUserUpdated: (updatedUser: User) => void,
}

function UpdateUserProfileSection({ onUserUpdated }: UpdateUserProfileSectionProps) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<UpdateUserProfileFormData>();

    async function onSubmit({ displayName, about, profileImage }: UpdateUserProfileFormData) {
        if (!displayName && !about && (!profileImage || profileImage.length === 0)) return;
        try {
            const updatedUser = await UsersApi.updateUser({ displayName, about, profileImage: profileImage?.item(0) || undefined });
            onUserUpdated(updatedUser);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <h2>Update your profile</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register("displayName")}
                    label="Display name"
                    placeholder="Display name"
                    maxLength={20}
                />
                <FormInputField
                    register={register("about")}
                    label="About me"
                    placeholder="Write a few thing about you"
                    as="textarea"
                    maxLength={20}
                />
                <FormInputField
                    register={register("profileImage")}
                    label="Profile image"
                    type="file"
                    accept="image/png,image/jpeg"
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>Update profile</LoadingButton>
            </Form>
        </div>
    )
}

interface UserBlogPostSectionProps {
    user: User;
}

function UserBlogPostSection({ user }: UserBlogPostSectionProps) {
    const { data, isLoading, error } = useSWR(user._id, BlogApi.getBlogPostsByUser)
    return (
        <div>
            <h2>Blog posts</h2>
            <div className="d-flex flex-column align-items-center">
                {isLoading && <Spinner animation="border" />}
                {error && <p>Blog posts could not be loaded</p>}
                {data?.length === 0 && <p>This user has not posted anything yet</p>}
            </div>
            {data && <BlogPostGrid posts={data} />}
        </div>
    )
}