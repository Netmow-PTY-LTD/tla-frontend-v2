import React from 'react'
import FirmDetailsPage from '../_components/FirmDetailsPage'

export default async function page({params}) {
    const {firmId}= await params

 

  return (
    <div>

        <FirmDetailsPage firmId={firmId}/>
      
    </div>
  )
}
