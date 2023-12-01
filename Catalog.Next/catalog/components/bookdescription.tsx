/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Tooltip } from '@mui/material';

export default function BookDescription({
    bookDescription
}: {
    bookDescription?: string
}) {
    return <>
        {!bookDescription &&
            <Tooltip title="No description available" arrow>
                <RemoveCircleIcon htmlColor='lightgrey' />
            </Tooltip>
        }
        {!!bookDescription &&
            <Tooltip title={bookDescription} arrow>
                <CheckCircleIcon htmlColor='green' />
            </Tooltip>
        }
    </>
}