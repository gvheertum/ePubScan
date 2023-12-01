/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { IBook, ReadStates } from "../lib/IBook"
import { useState } from 'react'
import ApiConsumer from "../lib/apiconsumer";
import { read } from "fs";
import { Alert, Button, Card, CardContent, Chip, Divider, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2


export default function BookDetail({
    book,
}: {
    book?: IBook
}) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [bookId, setBookId] = useState(book?.BookID);
    const [identifier, setIdentifier] = useState(book?.Identifier);
    const [title, setTitle] = useState(book?.Title);
    const [author, setAuthor] = useState(book?.Author);
    const [medium, setMedium] = useState(book?.Medium);
    const [nrOfPages, setNrOfPages] = useState(book?.NrOfPages);
    const [description, setDescription] = useState(book?.Description);
    const [readRemark, setReadRemark] = useState(book?.ReadRemark);
    const [readStatus, setReadStatus] = useState(book?.ReadStatus);
    const [status, setStatus] = useState(book?.Status);
    const [statusRemark, setStatusRemark] = useState(book?.StatusRemark);
    const apiConsumer = new ApiConsumer();

    async function updateData() {
        setSaving(true);
        await apiConsumer.updateDetails({
            BookID: bookId,
            Author: author,
            Description: description,
            Identifier: identifier,
            Medium: medium,
            NrOfPages: nrOfPages,
            Title: title
        });
        setSaving(false);
        setSaved(true);
    }

    async function updateReadData() {
        setSaving(true);
        await apiConsumer.updateReadStatus({
            BookID: bookId,
            ReadStatus: readStatus,
            ReadRemark: readRemark,
        });
        setSaving(false);
        setSaved(true);
    }

    async function updateAvailabilityData() {
        setSaving(true);
        await apiConsumer.updateAvailability({
            BookID: bookId,
            Status: status,
            StatusRemark: statusRemark,
        });
        setSaving(false);
        setSaved(true);
    }
console.log("rs", readStatus);
    return <>


        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <Typography variant="h5" component="div">
                            General data
                        </Typography>
                    </Grid>
                    <Grid xs={6}>
                        <TextField
                            disabled
                            fullWidth
                            label="BookID (db)"
                            value={bookId}
                        />
                    </Grid>
                    <Grid xs={6}>
                        <TextField
                            label="Identifier"
                            fullWidth
                            value={identifier}
                            onChange={(e) => { setIdentifier(e.target.value) }}
                        />
                    </Grid>
                    <Grid xs={6}>

                        <TextField
                            label="Title"
                            fullWidth
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }}
                        />
                    </Grid>
                    <Grid xs={6}>

                        <TextField
                            label="Author"
                            fullWidth
                            value={author}
                            onChange={(e) => { setAuthor(e.target.value) }}
                        />
                    </Grid>
                    <Grid xs={12}>

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            variant="standard"
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }}
                        />
                    </Grid>
                    <Grid xs={6}>

                        <Select
                            value={medium}
                            fullWidth
                            label="Medium"
                            onChange={(e) => { setMedium(e.target.value) }}
                        >
                            <MenuItem value={""}></MenuItem>
                            <MenuItem value={"ebook"}>ebook</MenuItem>
                            <MenuItem value={"Physical"}>Physical</MenuItem>
                            <MenuItem value={"Bundle"}>Bundle</MenuItem>
                        </Select>
                    </Grid>
                    <Grid xs={6}>

                        <TextField
                            label="Nr. of pages"
                            fullWidth
                            variant="standard"
                            value={nrOfPages}
                            onChange={(e) => { setNrOfPages(parseInt(e.target.value)) }}
                        />
                    </Grid>
                    <Grid xs={12}>

                        <Button fullWidth onClick={updateData} variant="contained">Update general data</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

        <Grid container spacing={2}>
            <Grid xs={6}>
                <Card variant="outlined">
                    <CardContent>
                        {/* Status */}
                        <Grid xs={12}>
                            <Typography variant="h5" component="div">
                                Read status
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <Select
                                    value={readStatus}
                                    label="Read status"
                                    fullWidth
                                    onChange={(e) => { setReadStatus(e.target.value) }}
                                >
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={new ReadStates().Read.display}>{new ReadStates().Read.display}</MenuItem>
                                    <MenuItem value={new ReadStates().Reading.display}>{new ReadStates().Reading.display}</MenuItem>
                                    <MenuItem value={new ReadStates().ToRead.display}>{new ReadStates().ToRead.display}</MenuItem>
                                    <MenuItem value={new ReadStates().WontRead.display}>{new ReadStates().WontRead.display}</MenuItem>
                                </Select>
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Read remark"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    value={readRemark}
                                    onChange={(e) => { setReadRemark(e.target.value) }}
                                />

                            </Grid>
                            <Grid xs={12}>
                                <Button fullWidth onClick={updateReadData} variant="contained">Update read status</Button>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid xs={6}>
                <Card>
                    <CardContent>

                        {/* Availability  */}
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <Typography variant="h5" component="div">
                                    Availability
                                </Typography>
                            </Grid>
                            <Grid xs={6}>
                                <Select
                                    value={status}
                                    label="Status"
                                    fullWidth
                                    onChange={(e) => { setStatus(e.target.value) }}
                                >
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"N/A"}>N/A</MenuItem>
                                    <MenuItem value={"Available"}>Available</MenuItem>
                                    <MenuItem value={"Lend-out"}>Lend-out</MenuItem>
                                    <MenuItem value={"Available at other location"}>Available at other location</MenuItem>
                                </Select>
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Status remark"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    value={statusRemark}
                                    onChange={(e) => { setStatusRemark(e.target.value) }}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Button fullWidth onClick={updateAvailabilityData} variant="contained">Update availability status</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>


        {/* Snackbars for updates */}
        <Snackbar open={saved} autoHideDuration={5000}>
            <Alert severity="success" sx={{ width: '100%' }}>
                Saved
            </Alert>
        </Snackbar>

        <Snackbar open={saving} autoHideDuration={5000}>
            <Alert severity="info" sx={{ width: '100%' }}>
                Saving
            </Alert>
        </Snackbar>

    </>
}