"use client";

interface Props {
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  address: string;
  className?: string;
}

export default function PropertyMap({
  latitude,
  longitude,
  placeId,
  address,
  className,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div
        className={`rounded-xl overflow-hidden h-72 bg-surface-container-high flex items-center justify-center text-on-surface-variant text-sm ${className ?? ""}`}
      >
        {address}
      </div>
    );
  }
  const zoom = 14;
  let src: string;
  if (latitude != null && longitude != null) {
    src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`;
  } else if (placeId) {
    src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}&zoom=${zoom}`;
  } else {
    src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&zoom=${zoom}`;
  }
  return (
    <div className={`rounded-xl overflow-hidden h-72 ${className ?? ""}`}>
      <iframe
        title="Property location"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
