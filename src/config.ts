// Everything you are likely to tweak lives here.

export const SERVICE_LINES = ['Xebia Data', 'Xebia Cloud']

export const LOCATIONS = ['Oostenburg', 'Hilversum', 'Eindhoven']

/** Downscale real photos so they match the pixel style (0 disables). */
export const PIXELATE_PHOTOS_TO = 160

/**
 * Microsoft Form that collects the picks. In Forms use
 * "..." -> "Get pre-filled URL", fill in every question, and copy the
 * link up to `id=...` into FORM_URL and each `r<hash>` parameter name below.
 * Leave FORM_URL empty to show a "form not connected yet" notice.
 */
export const FORM_URL = ''

export const FORM_FIELDS = {
  type: 'rTYPE',
  choice: 'rCHOICE',
  serviceLine: 'rSERVICELINE',
  location: 'rLOCATION',
}

/** Exact option labels of the "Type" choice question in the Form. */
export const FORM_TYPE_LABELS = { donate: 'Donation', present: 'Present' }

/** Option used for the location question when nothing needs delivering. */
export const NO_DELIVERY_LABEL = 'Not applicable (donation)'
