import { getEstateReviews } from '@/libs/apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const EstateId = params.id;

  try {
    const EstateReviews = await getEstateReviews(EstateId);

    return NextResponse.json(EstateReviews, {
      status: 200,
      statusText: 'Successful',
    });
  } catch (error) {
    console.log('Getting Review Failed', error);
    return new NextResponse('Unable to fetch', { status: 400 });
  }
}
