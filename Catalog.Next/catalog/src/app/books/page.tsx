'use client'
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Backdrop, CircularProgress, Chip, IconButton, AppBar, Box, Toolbar, Typography } from "@mui/material";
import BookLine from "../../../components/bookline";
import { IBook, ReadStateElement, ReadStates } from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"
import { useEffect, useState } from "react";
import ApiConsumer from "../../../lib/apiconsumer";
import { signOut } from "next-auth/react";
import Header from "../../../components/header";

export default function BookOverview() {
    
    const [allbooks, setAllBooks]: [IBook[], any] = useState([]);
    const [books, setBooks]: [IBook[], any] = useState([]);
    const [loading, setLoading]: [boolean, any] = useState(true);
    const [searchstringApplied, setSearchStringApplied] = useState("");
    const [filterstatus, setFilterStatus] : [ReadStateElement | null, any] = useState(null);
    
    

//TODO: Add filter logic
//TODO: Add search
//TODO: Add logic to set state directly
    
    useEffect(() => {
        console.log("First load!");
        setLoading(true);
        new ApiConsumer().getAllBooks().then(d => {
            var bookData = d?.reverse() ?? [];
            setAllBooks(bookData);
            setBooks(bookData);
            console.log("allbooks:", bookData);
            console.log("data:", allbooks)
            setLoading(false);
        })
    }, []);

   

    function applyFilter() {
        if(filterstatus == null && searchstringApplied == "") { console.log("No-op -> "); return; }
        setLoading(true);
        console.log("filter should be applied");
        console.log("status", filterstatus);
        console.log("string", searchstringApplied);
        setLoading(true);
        
        let filteredBooks = allbooks;

        if (filterstatus != null) {
            filteredBooks = filteredBooks.filter((b,i) => { 
                return b.ReadStatus == filterstatus.code || b.ReadStatus == filterstatus.display 
            });
        }
        
        if(searchstringApplied != "") {
            filteredBooks = filteredBooks.filter((b,i) => { 
                return (b.Author && b.Author!.toLocaleLowerCase().indexOf(searchstringApplied.toLocaleLowerCase()) > -1) || 
                    (b.Title && b.Title!.toLocaleLowerCase().indexOf(searchstringApplied.toLocaleLowerCase()) > -1) 
            });
        }
        
        // Set the books
        setBooks(filteredBooks);
        setLoading(false);


    }


    
    // On filter change, apply filter and wait for rebind
    useEffect(() => { console.log("filter change?"); applyFilter() }, [searchstringApplied, filterstatus])
    
    //Defer searching on string by keeping a wait
    //the search is NOT placed in state since eval took too long
    var toptr = -1;
    function deferSearch(searchval: string) {
        if(toptr != -1) { clearTimeout(toptr!); }

        if(searchval === "") { setSearchStringApplied(""); return; } //Clear directly or wait for a sec
        toptr = (window.setTimeout(() => { console.log("Setting the string:", searchval); setSearchStringApplied(searchval); }, 1000));
    }

    return <>
        <Header />

        <Chip variant="outlined" onClick={() => setFilterStatus(null)} label="No filter" />
        <Chip onClick={() => setFilterStatus(new ReadStates().Read)} color="success" label="Read" />
        <Chip onClick={() => setFilterStatus(new ReadStates().Reading)} color="primary" label="Reading" />
        <Chip onClick={() => setFilterStatus(new ReadStates().ToRead)} color="success" label="To Read" />
        <Chip onClick={() => setFilterStatus(new ReadStates().WontRead)} color="error" label="Wont read" />
        <Chip onClick={() => setFilterStatus(new ReadStates().Unknown)} color="default" label="Unknown" /> <br/>
        <input type="text" placeholder="Search text" id="txtSearch" onChange={(v)=> { deferSearch(v.target.value) }} />
        

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