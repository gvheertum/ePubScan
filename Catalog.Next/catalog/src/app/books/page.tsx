import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper } from "@mui/material";
import BookLine from "../../../components/bookline";
import { IBook } from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"

export default async function BookOverview() {
    let books = await new BookRepository().getAllBooks();

    return <>

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


    </>
}