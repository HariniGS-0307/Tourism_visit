interface MapEmbedProps {
  latitude: number;
  longitude: number;
  name?: string;
}

export default function MapEmbed({ latitude, longitude, name }: MapEmbedProps) {
  const mapsKey = process.env.GOOGLE_MAPS_API_KEY;

  if (mapsKey) {
    const src = `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${latitude},${longitude}&zoom=12`;
    return (
      <iframe
        title={name ? `Map of ${name}` : "Destination map"}
        width="100%"
        height="100%"
        className="border-0 w-full h-full"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      />
    );
  }

  const delta = 0.05;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <iframe
      title={name ? `Map of ${name}` : "Destination map"}
      width="100%"
      height="100%"
      className="border-0 w-full h-full"
      loading="lazy"
      src={osmSrc}
    />
  );
}
