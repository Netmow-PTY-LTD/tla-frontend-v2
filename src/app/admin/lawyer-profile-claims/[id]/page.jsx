'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useGetSingleLawyerProfileClaimQuery, 
  useUpdateLawyerProfileClaimStatusMutation 
} from '@/store/features/admin/lawyerProfileClaimService';
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Info, 
  Check, 
  X, 
  ArrowLeft,
  Loader2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import Link from 'next/link';

export default function LawyerProfileClaimDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reviewerNote, setReviewerNote] = useState('');
  
  const { 
    data: claimResponse, 
    isLoading, 
    isError,
    refetch 
  } = useGetSingleLawyerProfileClaimQuery(id, { skip: !id });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateLawyerProfileClaimStatusMutation();

  const claim = claimResponse?.data;

  const handleUpdateStatus = async (status) => {
    try {
      await updateStatus({
        id,
        status,
        reviewerNote: reviewerNote || `Claim ${status} by admin.`,
      }).unwrap();
      showSuccessToast(`Claim ${status} successfully.`);
      refetch();
    } catch (error) {
      showErrorToast(error?.data?.message || `Failed to update claim status.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">Could not load the claim request details.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/lawyer-profile-claims">Back to List</Link>
        </Button>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    approved: 'bg-green-100 text-green-700 hover:bg-green-100',
    rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/lawyer-profile-claims">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Claim Request Details</h1>
        <Badge className={statusColors[claim.status] || 'bg-gray-100 text-gray-700'}>
          {claim.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Claimer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Name" value={claim.claimerName} />
            <DetailItem label="Email" value={claim.claimerEmail} icon={<Mail className="h-4 w-4" />} />
            <DetailItem label="Phone" value={claim.claimerPhone} icon={<Phone className="h-4 w-4" />} />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Lawyer Email" value={claim.lawyerProfileEmail} icon={<Mail className="h-4 w-4" />} />
            <DetailItem label="Submitted On" value={new Date(claim.createdAt).toLocaleString()} icon={<Calendar className="h-4 w-4" />} />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-slate-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Claim Justification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2">REASON FOR CLAIM</h4>
            <div className="bg-white p-4 rounded-lg border text-gray-800 whitespace-pre-wrap">
              {claim.claimReason}
            </div>
          </div>
          {claim.additionalInfo && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">ADDITIONAL INFORMATION</h4>
              <div className="bg-white p-4 rounded-lg border text-gray-800 whitespace-pre-wrap">
                {claim.additionalInfo}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {claim.status === 'pending' && (
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Review and Take Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reviewer Note (Internal)</label>
              <Textarea 
                placeholder="Enter notes for this decision..." 
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleUpdateStatus('rejected')}
              disabled={isUpdating}
            >
              <X className="mr-2 h-4 w-4" />
              Reject Claim
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleUpdateStatus('approved')}
              disabled={isUpdating}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve and Upgrade
            </Button>
          </CardFooter>
        </Card>
      )}

      {claim.status !== 'pending' && claim.reviewerNote && (
        <Card className="shadow-sm border-none bg-slate-100/50">
          <CardHeader>
            <CardTitle className="text-lg">Review History</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailItem label="Reviewer Note" value={claim.reviewerNote} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</h4>
      <div className="flex items-center gap-2 text-gray-900 font-medium">
        {icon && <span className="text-gray-400">{icon}</span>}
        {value || 'N/A'}
      </div>
    </div>
  );
}
