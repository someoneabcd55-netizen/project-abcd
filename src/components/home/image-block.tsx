import Image from "next/image";

export function ImageBlock({ imageUrl, alt, height = "60vh" }) {
  return (
    <section className="relative w-full" style={{ height }}>
      <Image
        src={imageUrl}
        alt={alt || "image-block"}
        className="object-cover"
        fill
        priority
      />
    </section>
  );
}
