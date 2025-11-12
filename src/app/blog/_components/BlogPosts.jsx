'use client';
import Facebook from '@/components/icon/Facebook';
import Twitter from '@/components/icon/Twiiter';
import MainLayout from '@/components/main/common/layout';
import { truncateText } from '@/helpers/truncateText';
import {
  useGetAllBlogsQuery,
  useGetRecentBlogsQuery,
} from '@/store/features/admin/blogApiService';
import { ArrowRight, Instagram, Linkedin, Loader, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

export default function BlogPosts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: blogPosts,
    isLoading: isBlogPostsLoading,
    isFetching: isBlogPostsFetching,
  } = useGetAllBlogsQuery({
    page,
    limit,
    search,
  });

  const filteredPosts =
    blogPosts?.data?.length > 0 &&
    blogPosts?.data?.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
    );

  // Pagination info from API
  const pagination = blogPosts?.pagination;
  const totalPages = pagination?.totalPage || 1;
  const currentPage = pagination?.page || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const { data: recentBlogs } = useGetRecentBlogsQuery({ limit: 5 });

  if (isBlogPostsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--secondary-color)]" />
      </div>
    );
  }

  return (
    <MainLayout>
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-black)] mb-6 tracking-tight drop-shadow-lg">
              Our Blog
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
              Insights, tips, and news from The Law App team. Stay informed and
              empowered in your legal journey.
            </p>
            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none shadow-md transition-all"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Blog Posts (2/3) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {isBlogPostsFetching ? (
                <div className="flex justify-center items-center gap-2 py-20">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
                filteredPosts?.map((post) => (
                  <div
                    key={post?._id}
                    className="bg-white transition-all overflow-hidden flex flex-col border-b border-gray-200"
                  >
                    <img
                      src={post?.bannerImage}
                      alt={post?.title}
                      className="h-auto max-w-full object-cover rounded-t-xl"
                    />
                    <div className="py-6 flex flex-col flex-1">
                      <h2 className="text-2xl font-bold text-[var(--color-black)] mb-2 hover:underline cursor-pointer">
                        <Link href={`/blog/${post?.slug}`}>{post?.title}</Link>
                      </h2>
                      {/* Meta info row */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-teal-600">
                        {post?.createdAt ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 inline-block"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(post.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 inline-block"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Posted by{' '}
                          <span className="font-semibold">
                            {post?.author || 'The Law App Online'}
                          </span>
                        </span>
                      </div>

                      <div
                        className="text-gray-600 mb-4 flex-1"
                        dangerouslySetInnerHTML={{
                          __html: truncateText(post?.shortDescription, 2000),
                        }}
                      ></div>

                      <Link
                        href={`/blog/${post?.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-[18px] font-semibold text-[var(--secondary-color)] uppercase hover:underline"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 text-xl py-16">
                  No blog posts found.
                </div>
              )}
            </div>

            {/* Sidebar (1/3) */}
            <aside className="lg:col-span-1 flex flex-col gap-8">
              <div className="bg-white">
                <h3 className="text-xl font-extrabold text-black mb-4">
                  Recent Posts
                </h3>
                <ul className="space-y-4">
                  {Array.isArray(recentBlogs?.data) &&
                  recentBlogs?.data?.length > 0 ? (
                    [...recentBlogs?.data]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .slice(0, 5)
                      .map((post) => (
                        <li
                          key={post?._id}
                          className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 hover:shadow-md transition"
                        >
                          {post.bannerImage && (
                            <img
                              src={post.bannerImage}
                              alt={post.title}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div className="flex flex-col gap-1.5">
                            <Link
                              href={`/blog/${post?.slug}`}
                              className="font-semibold text-black text-sm truncate max-w-[300px] hover:underline"
                            >
                              {post.title}
                            </Link>
                            {post.createdAt && (
                              <div className="text-xs text-gray-400 flex items-center gap-2">
                                <svg
                                  className="w-3 h-3 inline-block"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(post.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))
                  ) : (
                    <li className="text-gray-500">No recent posts.</li>
                  )}
                </ul>
              </div>
              {/* Social Links Section */}
              <div className="bg-white p-6 mt-4">
                <h3 className="text-xl font-bold text-[var(--color-black)] mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-4">
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-blue-600"
                  >
                    <Facebook />
                  </Link>
                  <Link
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="hover:text-black"
                  >
                    <Twitter />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-pink-500"
                  >
                    <Instagram />
                  </Link>
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-blue-700"
                  >
                    <Linkedin />
                  </Link>
                </div>
              </div>
              {/* Tags Section */}
              <div className="bg-white p-6 mt-4">
                <h3 className="text-xl font-bold text-[var(--color-black)] mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    // Extract unique tags from all posts
                    const allTags = Array.isArray(blogPosts?.data)
                      ? blogPosts.data.flatMap((post) => post.tags || [])
                      : [];
                    const uniqueTags = [...new Set(allTags)];
                    return uniqueTags.length > 0 ? (
                      uniqueTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">No tags found.</span>
                    );
                  })()}
                </div>
              </div>
            </aside>
          </div>
          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              {/* Previous button with left arrow */}
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-lg border bg-white shadow hover:bg-purple-100 transition font-semibold ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[var(--color-black)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Smart pagination with ellipsis */}
              {(() => {
                const pages = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (currentPage <= 4) {
                    pages.push(1, 2, 3, 4, 5, '...', totalPages);
                  } else if (currentPage >= totalPages - 3) {
                    pages.push(
                      1,
                      '...',
                      totalPages - 4,
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages
                    );
                  } else {
                    pages.push(
                      1,
                      '...',
                      currentPage - 1,
                      currentPage,
                      currentPage + 1,
                      '...',
                      totalPages
                    );
                  }
                }

                return pages.map((p, idx) =>
                  p === '...' ? (
                    <span
                      key={idx}
                      className="px-3 py-2 text-gray-400 font-bold"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow font-semibold transition-all ${
                        p === currentPage
                          ? 'bg-[var(--primary-color)] text-white font-bold'
                          : 'bg-white hover:bg-purple-100 text-[var(--color-black)]'
                      }`}
                      onClick={() => handlePageChange(p)}
                      disabled={p === currentPage}
                    >
                      {p}
                    </button>
                  )
                );
              })()}

              {/* Next button with right arrow */}
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-lg border bg-white shadow hover:bg-purple-100 transition font-semibold ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[var(--color-black)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
