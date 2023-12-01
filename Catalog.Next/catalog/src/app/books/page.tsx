'use client'
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Backdrop, CircularProgress, Chip, IconButton, AppBar, Box, Toolbar, Typography, Link, CardContent, Card, TextField, Button } from "@mui/material";
import { IBook, ReadStateElement, ReadStates } from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"
import { useEffect, useState } from "react";
import ApiConsumer from "../../../lib/apiconsumer";
import { signOut } from "next-auth/react";
import Header from "../../../components/header";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ReadStatusBadge from "../../../components/readstatusbadge";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import "./books.css"
import BookDescription from "../../../components/bookdescription";

export default function BookOverview() {

    const [allbooks, setAllBooks]: [IBook[], any] = useState([]);
    const [books, setBooks]: [IBook[], any] = useState([]);
    const [loading, setLoading]: [boolean, any] = useState(true);
    const [searchstringApplied, setSearchStringApplied] = useState("");
    const [filterstatus, setFilterStatus]: [ReadStateElement | null, any] = useState(null);



    //TODO: Mobile friendly
    //TODO: Filters in popup?
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
        if (filterstatus == null && searchstringApplied == "") { console.log("No-op -> "); return; }
        setLoading(true);
        console.log("filter should be applied");
        console.log("status", filterstatus);
        console.log("string", searchstringApplied);
        setLoading(true);

        let filteredBooks = allbooks;

        if (filterstatus !== null && !filterstatus.matches(new ReadStates().All.code)) {
            filteredBooks = filteredBooks.filter((b, i) => {
                return b.ReadStatus == filterstatus.code || b.ReadStatus == filterstatus.display
            });
        }

        if (searchstringApplied !== "") {
            filteredBooks = filteredBooks.filter((b, i) => {
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
        if (toptr != -1) { clearTimeout(toptr!); }

        if (searchval === "") { setSearchStringApplied(""); return; } //Clear directly or wait for a sec
        toptr = (window.setTimeout(() => { console.log("Setting the string:", searchval); setSearchStringApplied(searchval); }, 1000));
    }

    const columns: GridColDef[] = [
        { field: 'Title', flex: 1, headerName: 'Title', width: 300 },
        { field: 'Author', flex: 1, headerName: 'Author', width: 300 },
        {
            field: 'Description', width: 60, headerName: 'Desc', renderCell: (params: GridRenderCellParams<any, string | undefined>) => (
                <><BookDescription bookDescription={params.value} /></>
            ),
        },
        {
            field: 'ReadStatus', width: 60, headerName: 'Status', renderCell: (params: GridRenderCellParams<any, string | undefined>) => (
                <><ReadStatusBadge readStatus={params.value} /></>
            ),
        },
        { field: 'NrOfPages', headerName: 'Pgs', width: 40 },
        {
            field: 'BookID', headerName: 'Id', width: 60, renderCell: (params: GridRenderCellParams<any, number>) => (
                <><Link href={"book/" + params.value}>Details</Link></>
            ),
        },
    ];

    return <>
        <Header />



        <Card className="filterCard">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <TextField
                            label="Filter"
                            fullWidth

                            onChange={(e) => { deferSearch(e.target.value) }}
                        />

                    </Grid>
                    <Grid xs={1}>
                        <Button fullWidth variant="outlined" onClick={() => setFilterStatus(new ReadStates().All)}>No Filter</Button>
                    </Grid>
                    <Grid xs={1}>
                        <Button variant="contained" fullWidth onClick={() => setFilterStatus(new ReadStates().Read)} color="success">Read</Button>
                    </Grid>
                    <Grid xs={1}>
                        <Button variant="contained" fullWidth onClick={() => setFilterStatus(new ReadStates().Reading)} color="primary">Reading</Button>
                    </Grid>
                    <Grid xs={1}>
                        <Button variant="contained" fullWidth onClick={() => setFilterStatus(new ReadStates().ToRead)} color="success">To Read</Button>
                    </Grid>
                    <Grid xs={1}>
                        <Button variant="contained" fullWidth onClick={() => setFilterStatus(new ReadStates().WontRead)} color="error">Won&apos;t</Button>
                    </Grid>
                    <Grid xs={1}>
                        <Button fullWidth onClick={() => setFilterStatus(new ReadStates().Unknown)}>Unknown</Button>
                    </Grid>



                </Grid>
            </CardContent>
        </Card>



        {!loading &&
            <DataGrid getRowId={(b: IBook) => b.BookID} rows={books} columns={columns} />
        }
        {loading &&
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }

    </>
}