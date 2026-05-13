import Image from "next/image";

type ImageBlockProps = {
  imageUrl: string;
  alt?: string;
  height?: string;
};

export function ImageBlock({ imageUrl, alt, height = "60vh" }: ImageBlockProps) {
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

