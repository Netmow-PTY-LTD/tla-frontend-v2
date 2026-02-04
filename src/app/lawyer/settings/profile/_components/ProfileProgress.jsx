'use client';

import Progress from '@/components/UIComponents/Progress';
import Link from 'next/link';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useMemo } from 'react';

export default function ProfileProgress() {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();

  const completion = useMemo(() => {
    const profile = userInfo?.data?.profile;
    if (!profile) return 0;

    let score = 0;

    // Basic Info (30%)
    if (profile.name) score += 5;
    if (profile.designation) score += 5;
    if (profile.bio) score += 5;
    if (profile.phone) score += 5;
    if (profile.gender) score += 5;
    if (profile.profilePicture) score += 5;

    // Contact & Location (15%)
    if (profile.address) score += 5;
    if (profile.lawyerContactEmail) score += 5;
    if (profile.languages && profile.languages.length > 0) score += 5;

    // Professional (15%)
    if (profile.law_society_member_number) score += 7.5;
    if (profile.practising_certificate_number) score += 7.5;

    // Experience (10%)
    if (profile.experience?.years || profile.experience?.months) score += 5;
    if (profile.experience?.experienceHighlight) score += 5;

    // Services (10%)
    if (profile.customService && profile.customService.length > 0) score += 10;

    // Accreditations (5%)
    if (profile.accreditation && profile.accreditation.length > 0) score += 5;

    // Social Media (5%)
    if (
      profile.socialMedia &&
      (profile.socialMedia.facebook ||
        profile.socialMedia.twitter ||
        profile.socialMedia.website)
    )
      score += 5;

    // Q&A (5%)
    if (profile.profileQA && profile.profileQA.some((qa) => qa.answer))
      score += 5;

    // Media Gallery (5%)
    if (
      profile.photos &&
      (profile.photos.photos?.length > 0 || profile.photos.videos?.length > 0)
    )
      score += 5;

    return Math.round(score);
  }, [userInfo]);

  if (isLoading) {
    return <div className="animate-pulse h-4 w-32 bg-gray-200 rounded mb-5" />;
  }

  return (
    <div className="space-y-2 mb-5">
      <p className="text-sm text-gray-700">
        Your profile is{' '}
        <span className="text-cyan-600 font-semibold">
          {completion} % complete
        </span>
      </p>

      <Progress completion={completion} />

      <p className="text-sm text-gray-400">
        Take a moment to improve your profile and make it stand out
      </p>

      <p className="text-sm text-gray-700">
        Make the best first impression with a strong legal profile — this is the
        first things clients see when deciding which lawyer to trust and hire .
        <Link href="/lawyer/dashboard/my-stats">
          <span className="text-cyan-600 font-semibold hover:underline ml-1">
            View profile
          </span>
        </Link>
      </p>
    </div>
  );
}
