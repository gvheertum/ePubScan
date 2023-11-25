import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { signOut } from "../auth";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {

    return <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        href='/'
                    >
                        <AutoStoriesIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        BookCatalog
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="Logout"
                        sx={{ mr: 2 }}
                        href='/logout/'
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    </>
}