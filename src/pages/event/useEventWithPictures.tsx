import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEvent } from "../../api/eventsApi";
import type { Event } from "../../types/apiTypes";
import { getUserProfilePicture } from "../../api/profileApi";

export function useEventWithPictures(eventId: number | null) {
  const [event, setEvent] = useState<Event>();
  const [pictures, setPictures] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const event = await getEvent(eventId);
        setEvent(event);

        const allPlayers = [
          ...(event.unnasignedPlayers || []),
          ...event.teams.flatMap((t) => t.players),
        ];

        const userIds = Array.from(
          new Set(
            allPlayers
              .map((p) => p.user?.id)
              .filter((id): id is number => typeof id === "number")
          )
        );

        const pictureMap: Record<number, string> = {};

        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const url = await getUserProfilePicture(userId);
              pictureMap[userId] = url;
            } catch {}
          })
        );

        setPictures(pictureMap);
      } catch {
        toast.error("Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  return { event, setEvent, pictures, loading };
}
