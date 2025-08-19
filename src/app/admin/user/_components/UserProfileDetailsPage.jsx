
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Phone, Facebook, Twitter, UserCheck, Shield, PhoneCall, AlertCircle } from "lucide-react";
import { useSingleUserQuery } from "@/store/features/admin/userApiService";

export default function UserProfileDetailsPage({ userId }) {
  const { data } = useSingleUserQuery(userId);
  const user = data?.data || {};




function formatCompanySize(size) {
  if (!size) return "N/A";

  // Match patterns like "11_50_employees"
  const match = size.match(/^(\d+)_+(\d+)_*employees$/i);
  if (match) {
    return `${match[1]}-${match[2]} Employees`;
  }

  // Fallback: replace underscores with spaces and capitalize
  return size
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

if (!user || !user.profile) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="border border-muted p-6 text-center max-w-md">
        <CardContent className="space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <CardTitle className="text-lg font-semibold">
            No User Data Found
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            The requested user does not exist or their profile is unavailable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}






  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl font-bold">{user.profile?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.profile?.designation}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">Role: {user.role}</Badge>
              <Badge variant="outline">Type: {user.regUserType}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{user.accountStatus}</Badge>
            {user.isOnline ? (
              <Badge className="bg-green-500">Online</Badge>
            ) : (
              <Badge variant="outline">Offline</Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Meta Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* <p><UserCheck className="inline w-4 h-4 mr-1" /> Needs Password Change: {user.needsPasswordChange ? "Yes" : "No"}</p> */}
          <p><Shield className="inline w-4 h-4 mr-1" /> Verified Account: {user.isVerifiedAccount ? "Yes" : "No"}</p>
          <p><Phone className="inline w-4 h-4 mr-1" />  Phone Verified: {user.isPhoneVerified ? "Yes" : "No"}</p>
          <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
          <p>Last Seen: {new Date(user.lastSeen).toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Company Info */}
      {user.profile?.companyProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Company:</strong> {user.profile.companyProfile.companyName}</p>
            <p><strong>Size:</strong> {formatCompanySize(user?.profile?.companyProfile?.companySize)}</p>
            <p><strong>Years in Business:</strong> {user.profile.companyProfile.yearsInBusiness}</p>
            <p><strong>Website:</strong>
              <a href={user.profile.companyProfile.website} target="_blank" className="text-blue-500 ml-1">
                {user.profile.companyProfile.website}
              </a>
            </p>
            <p><strong>Phone:</strong> {user.profile.companyProfile.phoneNumber}</p>
            <p className="text-muted-foreground">{user.profile.companyProfile.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Services */}
      {user.profile?.serviceIds?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.profile.serviceIds.map((s) => (
              <Badge key={s._id} variant="secondary">{s.name}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Custom Services */}
      {user.profile?.customService?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Services</CardTitle>
          </CardHeader>
          <CardContent>
            {user.profile.customService.map((cs) => (
              <div key={cs._id} className="mb-3">
                <p className="font-medium">{cs.title}</p>
                <p className="text-sm text-muted-foreground">{cs.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Credits & Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Credits & Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Credits:</strong> {user.profile?.credits}</p>
          <p><strong>Auto Top-up:</strong> {user.profile?.autoTopUp ? "Enabled" : "Disabled"}</p>
          {user.profile?.paymentMethods?.length > 0 ? (
            <ul className="list-disc pl-4">
              {user.profile.paymentMethods.map((pm, idx) => (
                <li key={idx}>{JSON.stringify(pm)}</li>
              ))}
            </ul>
          ) : (
            <p>No payment methods added</p>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      {user.profile?.experience && (
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p dangerouslySetInnerHTML={{ __html: user.profile.experience.experienceHighlight }} />
            <p className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: user.profile.experience.experience }} />
            <p className="mt-2 text-sm text-muted-foreground">
              {user.profile.experience.years} years {user.profile.experience.months} months
            </p>
          </CardContent>
        </Card>
      )}

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.profile?.photos?.photos?.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {user.profile.photos.photos.map((p, idx) => (
                <img key={idx} src={p} alt="Profile" className="w-40 h-40 object-cover rounded-lg shadow-md" />
              ))}
            </div>
          )}
          {user.profile?.photos?.videos?.length > 0 && (
            <div>
              <p className="font-medium mb-2">Videos</p>
              {user.profile.photos.videos.map((v, idx) => (
                <a key={idx} href={v} target="_blank" className="text-blue-500 block">{v}</a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accreditations */}
      {user.profile?.accreditation?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accreditations</CardTitle>
          </CardHeader>
          <CardContent>
            {user.profile.accreditation.map((acc) => (
              <div key={acc._id} className="mb-3">
                <p><strong>{acc.certificate_title}</strong> – {acc.institution}</p>
                <p className="text-sm text-muted-foreground">{acc.address}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Profile Q&A */}
      {user.profile?.profileQA?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Q&A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.profile.profileQA.map((qa, idx) => (
              <div key={idx}>
                <p className="font-medium">{qa.question}</p>
                <p className="text-muted-foreground">{qa.answer}</p>
                <Separator className="my-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      {user.profile?.faq?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            {user.profile.faq.map((f, idx) => (
              <div key={idx}>
                <p className="font-medium">{f.question}</p>
                <p className="text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Social Media */}
      {user.profile?.socialMedia && (
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            {user.profile.socialMedia.facebook && (
              <a href={user.profile.socialMedia.facebook} target="_blank"><Facebook className="w-5 h-5 text-blue-600" /></a>
            )}
            {user.profile.socialMedia.twitter && (
              <a href={user.profile.socialMedia.twitter} target="_blank"><Twitter className="w-5 h-5 text-sky-500" /></a>
            )}
            {user.profile.socialMedia.website && (
              <a href={user.profile.socialMedia.website} target="_blank"><Globe className="w-5 h-5 text-gray-600" /></a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" /> {user.profile?.lawyerContactEmail || user.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" /> {user.profile?.phone}
          </p>
          <p><strong>Address:</strong> {user.profile?.address}</p>
        </CardContent>
      </Card>
    </div>
  );
}
