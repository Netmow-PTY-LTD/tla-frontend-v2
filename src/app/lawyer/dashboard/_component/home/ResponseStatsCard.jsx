import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';
import Link from 'next/link';

const ResponseStatsCard = () => {
  const { data: allMyResponses, isLoading } = useGetAllMyResponsesQuery();

  console.log('pending ===>', allMyResponses);

  const totalResponse = allMyResponses?.data.length ?? 0;
  const hiredResponse =
    allMyResponses?.data?.filter((response) => response.status === 'hired')
      ?.length ?? 0;
  const pendingResponse =
    allMyResponses?.data?.filter((response) => response.status === 'pending')
      ?.length ?? 0;
  const archiveResponse =
    allMyResponses?.data?.filter((response) => response.status === 'archive')
      ?.length ?? 0;

  return (
    <Card className="w-full shadow-sm rounded-2xl">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Responses</h2>
        <Link href="/lawyer/dashboard/my-responses">
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
      </div>

      <hr className="border-t border-[#D9D9D9]" />

      <div className="flex items-center justify-center w-full h-[80%] ">
        <div className="flex items-center justify-center gap-6 p-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white">
              <p className="text-2xl font-bold">
                {' '}
                {isLoading ? '...' : pendingResponse}
              </p>
            </div>
            <span className="text-sm font-medium mt-1">Pending</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white">
              <p className="text-2xl font-bold">
                {isLoading ? '...' : hiredResponse}
              </p>
            </div>
            <span className="text-sm font-medium mt-1">Hired</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500 text-white">
              <p className="text-2xl font-bold">
                {isLoading ? '...' : archiveResponse}
              </p>
            </div>
            <span className="text-sm font-medium mt-1">Archived</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResponseStatsCard;
