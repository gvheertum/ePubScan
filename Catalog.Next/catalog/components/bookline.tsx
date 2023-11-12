/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import Button from '@mui/material/Button';
import Link from "next/link"
import { IBook } from "../lib/IBook"
import "./bookline.css"
import BookRepository from "../lib/bookrepository";
import ApiConsumer from "../lib/apiconsumer";
import { Accordion, AccordionDetails, AccordionSummary, Badge, TableCell, TableRow, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ReadStatusBadge from './readstatusbadge';

export default function BookLine({
  book,
  key,
}: {
  book?: IBook
  key?: any
}) {

  async function updateReadTag(tag: string) { await new ApiConsumer().updateReadStatusBadge({ BookID: book?.BookID, ReadStatus: tag }); }


  return <TableRow
    key={key}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row">
      <span>{book!.Title}</span>
      
    </TableCell>
    <TableCell align="right">{book!.Author}</TableCell>
    <TableCell align="right">
      <ReadStatusBadge readStatus={book?.ReadStatus} nrOfPages={book?.NrOfPages} />
    
    </TableCell>
    <TableCell align="right"><Link href={"book/" + book?.BookID}>Details</Link></TableCell>
  </TableRow>
}