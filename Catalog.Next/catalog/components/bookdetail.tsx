/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { IBook } from "../lib/IBook"
import { useState } from 'react'
import ApiConsumer from "../lib/apiconsumer";
import { read } from "fs";
import { Alert, Button, Snackbar } from "@mui/material";

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
        Status: status ,
        StatusRemark: statusRemark,
    });
    setSaving(false);
    setSaved(true);
  }


  return <>
      
        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">BookID (db)</span>
            </div>
            <input type="text" value={bookId} className="form-control" readOnly />
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Identifier</span>
            </div>
            <input type="text" value={identifier} className="form-control" onChange={(e) => { setIdentifier(e.target.value) }}  />
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Title</span>
            </div>
            <input type="text" className="form-control" value={title}  onChange={(e) => { setTitle(e.target.value) }} />
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Author</span>
            </div>
            <input type="text" className="form-control" value={author} onChange={(e) => { setAuthor(e.target.value) }} />
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Description</span>
            </div>
            <textarea id="readRemark" className="form-control" value={description} onChange={(e) => { setDescription(e.target.value) }}></textarea>
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Medium</span>
            </div>
            <select id="medium" className="form-control" value={medium} onChange={(e) => { setMedium(e.target.value) }}>
                    <option></option>
                    <option>ebook</option>
                    <option>Physical</option>
                    <option>Bundle</option>
                </select>
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Nr. of pages</span>
            </div>
            <input type="number" className="form-control" value={nrOfPages} onChange={(e) => { setNrOfPages(parseInt(e.target.value)) }} />

        </div>
         
        <Button onClick={updateData} variant="contained">Update general data</Button>
            
      {/* Status */}
        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Read status</span>
            </div>
            <select id="readStatus" value={readStatus} className="form-control" onChange={(e) => { setReadStatus(e.target.value) }}>
                <option></option>
                <option className="read">Read</option>
                <option className="reading">Reading</option>
                <option className="toread">To read</option>
                <option className="notgoingtoread">Not going to read</option>
            </select>
        </div>

        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Read remark</span>
            </div>
            <textarea id="readRemark" value={readRemark} className="form-control" onChange={(e) => { setReadRemark(e.target.value) }}></textarea>
        </div>
        
        <Button onClick={updateReadData} variant="contained">Update read status</Button>

   
    {/* Availability  */}
        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Status</span>
            </div>
            
            <select id="status" className="form-control" value={status} onChange={(e) => { setStatus(e.target.value) }} > 
                <option></option>
                <option>N/A</option>
                <option>Available</option>
                <option>Lend-out</option>
                <option>Available at other location</option>
            </select>
        </div>
    
        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">Status remark</span>
            </div>
            <textarea className="form-control" id="statusRemark" value={statusRemark} onChange={(e) => { setStatusRemark(e.target.value) }}></textarea>
        </div>
        <Button onClick={updateAvailabilityData} variant="contained">Update availability status</Button>



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