import { CaseArchive } from "@/components/CaseArchive";
import { getCaseStudies, getCategories } from "@/lib/wordpress";

// "/" — o arquivo do Draft E com todos os case studies.
export default async function Home() {
  const [studies, categories] = await Promise.all([getCaseStudies(), getCategories()]);

  return <CaseArchive studies={studies} totalPublished={studies.length} categories={categories} />;
}
