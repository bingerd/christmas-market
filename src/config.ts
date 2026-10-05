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
export const FORM_URL =
  'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=6hdNPeQaBUeUflE2nFpfeRe7s6hEHjtAv5p-c-Om00VUN1lETTM5QTIyTktUUDE4WE0zM09TSllPSS4u'

export const FORM_FIELDS = {
  type: 'r54dbe032d6524439bb08affc140c5c55',
  choice: 'rf16a26331c434f359a5c0eb3cfb53989',
  serviceLine: 'r4d3b4f17e7384961ae7758254e6c7446',
  location: 're39b88cc40f54952a015ab44611c29f0',
}

/** Exact option labels of the "Type" choice question in the Form. */
export const FORM_TYPE_LABELS = { donate: 'Donation', present: 'Present' }

/** Option used for the location question when nothing needs delivering. */
export const NO_DELIVERY_LABEL = 'Not applicable (donation)'
