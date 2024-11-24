import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getStaticProps() {
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames.map((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        return {
            slug: filename.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
            description: data.description,
        };
    });

    return { props: { posts } };
}

export default function Home({ posts }) {
    return (
        <div>
            <h1>My Blog</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`}>
                            <a>
                                <h2>{post.title}</h2>
                                <p>{post.description}</p>
                                <p>{post.date}</p>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
