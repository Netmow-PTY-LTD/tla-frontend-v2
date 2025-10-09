import React from 'react'
import CompanyProfile from './CompanyProfile'
import CompanyLocation from './CompanyLocation'
import CompanyAbout from './CompanyAbout'

export default function Company({companyInfo}) {
    return (
        <>
            <CompanyProfile />
            <div className="border-t border-white" />
            <CompanyLocation companyInfo={companyInfo?.firmProfileId} />
            <div className="border-t border-white" />
            <CompanyAbout />
        </>
    )
}
