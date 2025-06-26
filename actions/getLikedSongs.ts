import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    // console.log('User not authenticated or missing ID');
    return [];
  }

  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  // if (!data) {
  //   return [];
  // }

  if (!data) {
  console.log('No liked song data returned');
  return [];
}

console.log('Liked Songs Data:', data);


  // return data.map((item) => ({
  //   //* Spread relation
  //   ...item.songs,
  // }));

  return data
  .filter((item) => item.songs !== null)
  .map((item) => ({ ...item.songs }));
};
