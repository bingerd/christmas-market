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
  type: 'r216c11cc9c874799ad9918ce6b9f2e38',
  choice: 'r0f7cebee6763497084d16823c9bd52bb',
  serviceLine: 'r7752664f82764904bac18f16d7266bfb',
  location: 'r8a4bf3d8faa840c5a467830b911cae9a',
}

/** Exact option labels of the "Type" choice question in the Form. */
export const FORM_TYPE_LABELS = { donate: 'Donation', present: 'Present' }

/** Option used for the location question when nothing needs delivering. */
export const NO_DELIVERY_LABEL = 'Not applicable (donation)'
