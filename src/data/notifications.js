const emailNotificationOptions = [
  { label: 'New leads I receive', key: 'newLeads' },
  {
    label: "Customers closing leads I've responded to",
    key: 'closingLeadsRespondedTo',
  },
  //   { label: 'Customers dismissing my response', key: 'dismissingMyResponse' },
  { label: 'Customers hiring me', key: 'hiringMe' },
  //   { label: 'Customers reading a message I sent', key: 'readingMyMessage' },
  //   { label: 'Customers requesting a call from me', key: 'requestingCall' },
  //   {
  //     label: 'Customers requesting me to contact them',
  //     key: 'requestingContact',
  //   },
  //   { label: 'Customers viewing my profile', key: 'viewingProfile' },
  //   { label: 'Customers viewing my website', key: 'viewingWebsite' },
  //   {
  //     label: "A summary of leads I'm matched to each day",
  //     key: 'dailyLeadsSummary',
  //   },
  //   { label: 'Customers sending me a message', key: 'sendingMessage' },
  //   { label: 'New reviews on my profile', key: 'newProfileReviews' },
  //   { label: 'New reviews from other sources', key: 'newExternalReviews' },
  //   {
  //     label: 'Services similar to mine I can get more leads from',
  //     key: 'similarServices',
  //   },
];

const browserNotificationOptions = [
  { label: 'New leads I receive', key: 'newTasks' },
  { label: 'Customers sending me a message', key: 'customerMessages' },
  { label: 'New reviews on my profile', key: 'newReviews' },
];

export { emailNotificationOptions, browserNotificationOptions };
