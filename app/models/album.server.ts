import type { User } from "./user.server";
import { supabase } from "./user.server";

export type Album = {
  id: string;
  title: string;
  artist: string;
  location: string;
  genre: string;
  media: string;
  profile_id: string;
};



export async function getAllAlbums({ userId }: { userId: User["id"] }) {
  const { data } = await supabase
    .from("albums")
    .select("id, title, location, genre, media, artists ( name )")
    .eq("profile_id", userId);

  return data;
}

export async function createAlbum({
  title,
  artistId,
  genre,
  location,
  userId,
  media
}:
 Pick<Album, "location" | "genre" | "title" | "media"> & { userId: User["id"] } & {artistId: number}
 ) 
{
  const { data, error } = await supabase
    .from("albums")
    .insert([{ title, location, genre, artistId, media, profile_id: userId }])
    .single();

  if (!error) {
    return data;
  }

  return null;
}

export async function deleteAlbum({
  id,
  userId,
}: Pick<Album, "id"> & { userId: User["id"] }) {
  const { error } = await supabase
    .from("albums")
    .delete({ returning: "minimal" })
    .match({ id, profile_id: userId });

  if (!error) {
    return {};
  }

  return null;
}

export async function getAlbum({
  id,
  userId,
}: Pick<Album, "id"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("albums")
    .select("id, title, location, genre, media, artists ( name )")
    .eq("profile_id", userId)
    .eq("id", id)
    .single();

  if (!error) {
    return {
      userId: data.profile_id,
      id: data.id,
      title: data.title,
      location: data.location,
      genre: data.genre,
      media: data.media,
      artist: data.artist
    };
  }

  return null;
}
