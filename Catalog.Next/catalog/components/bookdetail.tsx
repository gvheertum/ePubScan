/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { IBook, ReadStates } from "../lib/IBook"
import { useState } from 'react'
import ApiConsumer from "../lib/apiconsumer";
import { Alert, Button, Card, CardContent, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import "./bookdetail.css";

const readStates = new ReadStates();

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

    return <>
        <section className="book-detail-shell">
        <section className="book-detail-hero">
            <div>
                <p className="catalog-eyebrow">Book Detail</p>
                <div className="book-detail-titleline">
                    <h1>{title || "Untitled book"}</h1>
                    <span className={`book-detail-status-pill ${getDetailStatusPillClass(readStatus)}`}>
                        {getDetailStatusLabel(readStatus)}
                    </span>
                </div>
                <p>{author || "Unknown author"}</p>
                <p>{identifier || "No identifier set"}</p>
            </div>
            <div className="book-detail-hero-aside">
                <span className="book-detail-id">Book #{bookId}</span>
            </div>
        </section>

        <Card variant="outlined" className="book-detail-card">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <h2>General data</h2>
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
                            rows={6}
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
                            type="number"
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

        <section className="book-detail-grid">
            <Card variant="outlined" className="book-detail-card">
                <CardContent>
                    <div className="book-detail-card-header">
                        <h2>Read status</h2>
                        <p>Track whether the book is finished, in progress, or still waiting in the queue.</p>
                    </div>
                    <div className="book-detail-panel-grid">
                        <div className="book-detail-panel-stack">
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
                            <TextField
                                label="Read remark"
                                multiline
                                fullWidth
                                rows={4}
                                value={readRemark}
                                onChange={(e) => { setReadRemark(e.target.value) }}
                            />
                        </div>
                        <Button fullWidth onClick={updateReadData} variant="contained">Update read status</Button>
                    </div>
                </CardContent>
            </Card>

            <Card variant="outlined" className="book-detail-card">
                <CardContent>
                    <div className="book-detail-card-header">
                        <h2>Availability</h2>
                        <p>Keep the physical or lending state clear so the catalog is useful at a glance.</p>
                    </div>
                    <div className="book-detail-panel-grid">
                        <div className="book-detail-panel-stack">
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
                            <TextField
                                label="Status remark"
                                multiline
                                fullWidth
                                rows={4}
                                value={statusRemark}
                                onChange={(e) => { setStatusRemark(e.target.value) }}
                            />
                        </div>
                        <Button fullWidth onClick={updateAvailabilityData} variant="contained">Update availability status</Button>
                    </div>
                </CardContent>
            </Card>
        </section>
        </section>


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

function getDetailStatusLabel(readStatus?: string): string {
    if (readStates.Read.matches(readStatus)) {
        return "Read";
    }

    if (readStates.Reading.matches(readStatus)) {
        return "Reading";
    }

    if (readStates.ToRead.matches(readStatus)) {
        return "To Read";
    }

    if (readStates.WontRead.matches(readStatus)) {
        return "Won't Read";
    }

    return "Unknown";
}

function getDetailStatusPillClass(readStatus?: string): string {
    if (readStates.Read.matches(readStatus)) {
        return "book-detail-status-pill-read";
    }

    if (readStates.Reading.matches(readStatus)) {
        return "book-detail-status-pill-reading";
    }

    if (readStates.ToRead.matches(readStatus)) {
        return "book-detail-status-pill-toread";
    }

    if (readStates.WontRead.matches(readStatus)) {
        return "book-detail-status-pill-wontread";
    }

    return "book-detail-status-pill-unknown";
}
