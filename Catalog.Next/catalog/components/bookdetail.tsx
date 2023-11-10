/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { IBook } from "../lib/IBook"
import { useState } from 'react'
import ApiConsumer from "../lib/apiconsumer";
import { read } from "fs";

export default function BookDetail({
  book,
}: {
  book?: IBook
}) {
  
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

    await apiConsumer.updateDetails({
        BookID: bookId,
        Author: author,
        Description: description,
        Identifier: identifier,
        Medium: medium,
        NrOfPages: nrOfPages,
        Title: title
    });
  }
  
  async function updateReadData() { 
    await apiConsumer.updateReadStatus({
        BookID: bookId,
        ReadStatus: readStatus,
        ReadRemark: readRemark,
    });
  }

  async function updateAvailabilityData() { 
    await apiConsumer.updateAvailability({
        BookID: bookId,
        Status: status ,
        StatusRemark: statusRemark,
    });
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
         
        <div className="card-footer text-muted">
            <button className="btn btn-info" onClick={updateData} type="button">Update book data</button>
        </div>

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
        
        <div className="card-footer text-muted">
            <button className="btn btn-info" onClick={updateReadData} type="button">Update read status</button>
        </div>
   
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
        <div className="card-footer text-muted">
            <button className="btn btn-info" onClick={updateAvailabilityData} type="button">Update availability status</button>
        </div>
    

    </>
}