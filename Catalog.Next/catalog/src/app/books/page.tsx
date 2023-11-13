'use client'
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Backdrop, CircularProgress, Chip } from "@mui/material";
import BookLine from "../../../components/bookline";
import { IBook, ReadStateElement, ReadStates } from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"
import { useEffect, useState } from "react";
import ApiConsumer from "../../../lib/apiconsumer";

export default function BookOverview() {
    const [allbooks, setAllBooks]: [IBook[], any] = useState([]);
    const [books, setBooks]: [IBook[], any] = useState([]);
    const [loading, setLoading]: [boolean, any] = useState(true);
    const [searchstring, setSearchString] = useState("");

    

//TODO: Add filter logic
//TODO: Add search
//TODO: Add logic to set state directly


    const getData = () => {
        console.log("Getting data!");
        setLoading(true);
        new ApiConsumer().getAllBooks().then(d => {
            var bookData = d?.reverse() ?? [];
            setAllBooks(bookData);
            setBooks(bookData);
            setLoading(false);
        })
    }

    const filterName = (search: string) => {
        setLoading(true);
        console.log("filtering on:", search);
        let filteredBooks = allbooks;
        if(search != "") {
            filteredBooks = allbooks.filter((b,i) => { 
                return (b.Author && b.Author!.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1) || 
                    (b.Title && b.Title!.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1) 
            });
        } 
        
        setBooks(filteredBooks);
        setLoading(false);
    }

    const resetFilter = () => {
        setLoading(true);
        setBooks(allbooks);
        setLoading(false);
    }

    const filterStatus = (status: ReadStateElement) => {
        setLoading(true);
        
        let filteredBooks = allbooks.filter((b,i) => { 
            return b.ReadStatus == status.code || b.ReadStatus == status.display 
        });
        
        setBooks(filteredBooks);
        setLoading(false);
    }

    useEffect(() => { getData() }, [])

    return <>
        <Chip variant="outlined" onClick={() => resetFilter()} label="No filter" />
        <Chip onClick={() => filterStatus(new ReadStates().Read)} color="success" label="Read" />
        <Chip onClick={() => filterStatus(new ReadStates().Reading)} color="primary" label="Reading" />
        <Chip onClick={() => filterStatus(new ReadStates().ToRead)} color="success" label="To Read" />
        <Chip onClick={() => filterStatus(new ReadStates().WontRead)} color="error" label="Wont read" />
        <Chip onClick={() => filterStatus(new ReadStates().Unknown)} color="default" label="Unknown" /> <br/>
        <input type="text" placeholder="Search text" id="txtSearch" onBlur={(v)=> setSearchString(v.target.value) } />
        <button onClick={() => filterName(searchstring) }>Search</button>

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