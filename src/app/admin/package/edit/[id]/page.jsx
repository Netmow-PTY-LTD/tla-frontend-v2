import React from 'react';

export default function Page({ params }) {
  const id = params.id;

  return <div>Edit Package Page {id}</div>;
}
