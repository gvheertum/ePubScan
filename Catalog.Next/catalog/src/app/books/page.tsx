'use client'
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Backdrop, CircularProgress } from "@mui/material";
import BookLine from "../../../components/bookline";
import { IBook } from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"
import { useEffect, useState } from "react";
import ApiConsumer from "../../../lib/apiconsumer";

export default function BookOverview() {
    const [books, setBooks]: [IBook[], any] = useState([]);
    const [loading, setLoading]: [boolean, any] = useState(true);

//TODO: Add filter logic
//TODO: Add search
//TODO: Add logic to set state directly


    const getData = () => {
        setLoading(true);
        new ApiConsumer().getAllBooks().then(d => {
            console.log("Data:", d);
            setBooks(d?.reverse());
            setLoading(false);
        })
    }

    useEffect(() => { getData() }, [])

    return <>
        {!loading &&
            <TableContainer component={Paper} sx={{ width: '100%', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((b: IBook, i) => (
                            <BookLine key={b.BookID} book={b} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        }
        {loading &&
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }

    </>
}