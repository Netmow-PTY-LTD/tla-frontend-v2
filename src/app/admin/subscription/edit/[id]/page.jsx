import React from 'react';

export default function Page({ params }) {
  const id = params.id;
  console.log('router', id);
  return <div>Edit Subscription Page {id} </div>;
}
