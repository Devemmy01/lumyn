import { buildMetadata } from '../lib/seo';

const metadata = buildMetadata({
  title: "Test Title",
  description: "Test Description",
  path: "/test-path",
  ogImage: "/test-image.png",
  type: "article"
});

console.log(JSON.stringify(metadata, null, 2));
