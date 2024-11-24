import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getStaticPaths() {
    const filenames = fs.readdirSync(postsDirectory);
    const paths = filenames.map((filename) => ({
        params: { slug: filename.replace(/\.md$/, '') },
    }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const filePath = path.join(postsDirectory, `${params.slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(html).process(content);
    const htmlContent = processedContent.toString();

    return { props: { data, htmlContent } };
}

export default function BlogPost({ data, htmlContent }) {
    return (
        <article>
            <h1>{data.title}</h1>
            <p>{data.date}</p>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>
    );
}
