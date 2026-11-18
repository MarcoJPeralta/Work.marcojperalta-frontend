import Image from "next/image";
import { author, site } from "@/content/site";
import { Button } from "./ui";

export function AuthorCard() {
  return (
    <section className="author">
      <Image src={site.portrait} alt="Portrait of Marco Peralta" width={88} height={88} />
      <div>
        <p className="author-tagline">{author.tagline}</p>
        <p className="muted small">{author.bio}</p>
      </div>
      <Button href={site.contactUrl}>{author.cta}</Button>
    </section>
  );
}
