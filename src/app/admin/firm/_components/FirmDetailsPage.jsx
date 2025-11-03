

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSingFirmDetailsQuery } from '@/store/features/admin/firmsApiService'
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  Users,
  AlertTriangle,
  Loader,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function FirmDetailsPage({ firmId }) {
  const { data, isLoading, isError, refetch } = useGetSingFirmDetailsQuery(firmId)

  // Derived values
  const firm = data?.data
  const contact = firm?.contactInfo || {}
  const country = contact?.country?.name
  const city = contact?.city?.name
  const zip = contact?.zipCode?.postalCode

  //  Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 space-y-4">
        <Loader className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm">Loading firm details...</p>
      </div>
    )
  }

  //  Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="text-gray-600">Failed to fetch firm details.</p>
        <Button onClick={() => refetch()} variant="default" className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  //  Empty state
  if (!firm) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <Building2 className="w-10 h-10 text-gray-400 mb-2" />
        <p>No firm details available.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md bg-gray-100">
          {firm.logo ? (
            <Image src={firm.logo} alt={firm.firmName} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Logo
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            {firm.firmName}
          </h1>
          <p className="text-sm text-gray-500">
            Registration No: {firm.registrationNumber} • Established {firm.yearEstablished}
          </p>
          <div className="flex flex-wrap gap-4 mt-2 text-gray-700">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" /> {city}, {country} ({zip})
            </span>
            {contact?.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" /> {contact.phone}
              </span>
            )}
            {contact?.email && (
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" /> {contact.email}
              </span>
            )}
            {contact?.officialWebsite && (
              <a
                href={contact.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Credits and Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Credit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-gray-700">
              <span>Current Balance</span>
              <span className="font-semibold text-lg">
                {firm?.credits?.currentCreditBalance} {firm?.credits?.defaultCurrency}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Firm Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-gray-700">
              <span>Status</span>
              <span
                className={`capitalize font-medium ${
                  firm.status === 'approved'
                    ? 'text-green-600'
                    : firm.status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {firm.status}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lawyers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Lawyers ({firm?.lawyers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {firm?.lawyers?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firm.lawyers.map((lawyer) => (
                <div
                  key={lawyer._id}
                  className="border rounded-2xl shadow-sm p-4 hover:shadow-lg transition bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      {lawyer.profilePicture ? (
                        <Image
                          src={lawyer.profilePicture}
                          alt={lawyer.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{lawyer.name}</h3>
                      <p className="text-sm text-gray-500">{lawyer.designation || 'Lawyer'}</p>
                      <p className="text-xs text-gray-400 capitalize">{lawyer.firmMembershipStatus}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p>
                      <Mail className="inline w-4 h-4 mr-1 text-gray-500" /> {lawyer.lawyerContactEmail}
                    </p>
                    <p>
                      <Phone className="inline w-4 h-4 mr-1 text-gray-500" /> {lawyer.phone}
                    </p>
                    <p>
                      <MapPin className="inline w-4 h-4 mr-1 text-gray-500" /> {lawyer.address}
                    </p>
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4" /> Practice Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {lawyer?.serviceIds?.map((s) => (
                        <span
                          key={s._id}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(lawyer.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Users className="w-8 h-8 mb-2 text-gray-400" />
              <p>No lawyers associated with this firm.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
