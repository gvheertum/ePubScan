/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ReadStates } from "../lib/IBook"
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { Badge, Chip, Tooltip } from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


export default function ReadStatusBadge({
  readStatus,
  nrOfPages
}: {
  readStatus?: string,
  nrOfPages?: number
}) {
  var states = new ReadStates();
  return <>
  <Tooltip title={readStatus ?? "Unknown"}>
    {states.Read.matches(readStatus) &&
      <><BookmarkAddedIcon color="success" /></>
    }
    {states.Reading.matches(readStatus) &&
      <><LocalLibraryIcon color="primary" /></>
    }
    {states.WontRead.matches(readStatus) &&
      <><BookmarkRemoveIcon color="error" /></>
    }
    {states.ToRead.matches(readStatus) &&
      <><BookmarkAddIcon color="success" /></>
    }
    {states.Unknown.matches(readStatus) &&
      <><BookmarkBorderIcon color="disabled" /></>
    }
    </Tooltip>
    {nrOfPages !== null && 
    <>
      <Chip label={(nrOfPages ? (nrOfPages + "p") : "")} variant="outlined" />
      <Badge badgeContent={(nrOfPages ? (nrOfPages + "p") : "")} color="info" ><AutoStoriesIcon color="disabled" /></Badge>
      </>
    }
  </>
}