import { useUser } from "@auth0/nextjs-auth0/client";

export default function UserDetail() {
    const { user, error, isLoading } = useUser();
    return (
        <>
            {error && <p>Error: {error.message}</p>}
            {isLoading && <p>Loading</p>}
            {user &&
                <div>
                    <img src={user!.picture!} alt={user!.name!} />
                    <h2>{user!.name}</h2>
                    <p>{user!.email}</p>
                </div>
            }
        </>
    );
}