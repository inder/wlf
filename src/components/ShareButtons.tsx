'use client';

import { useState } from 'react';

const SHARE_TEXT = 'Follow the money behind Trump\'s crypto empire. Every claim is sourced.';

function getCurrentUrl() {
  return typeof window !== 'undefined' ? window.location.href : '';
}

export default function ShareButtons({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(getCurrentUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    const pageUrl = getCurrentUrl();
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareFacebook = () => {
    const pageUrl = getCurrentUrl();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareSMS = () => {
    const pageUrl = getCurrentUrl();
    const body = `${SHARE_TEXT} ${pageUrl}`;
    window.location.href = `sms:?&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500 mr-1">Share</span>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors"
        title="Copy link"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
      </button>

      {/* X / Twitter */}
      <button
        onClick={shareX}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors"
        title="Share on X"
      >
        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={shareFacebook}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors"
        title="Share on Facebook"
      >
        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* SMS */}
      <button
        onClick={shareSMS}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors"
        title="Share via SMS"
      >
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
}
