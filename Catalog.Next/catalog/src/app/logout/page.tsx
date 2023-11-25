import { Button } from "@mui/material";
import { signOut } from "../../../auth";



export default async function LogoutPage() {
    
    return <>
        <h1>Log out?</h1>
        <form action={async () => {
            'use server';
            await signOut();
          }}         
        ><input type="submit" value="Perform logout" /></form>
    </>
}
