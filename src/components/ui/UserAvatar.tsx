"use client";

import { useState } from "react";

interface UserAvatarProps {
  avatarUrl?: string | null;
  initials: string;
  size?: number; // px
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  initials,
  size = 32,
  className = "",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!avatarUrl && !imgError;
  console.log("[UserAvatar] avatarUrl:", avatarUrl, "| initials:", initials, "| showImage:", showImage);

  const style = { width: size, height: size };

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-primary/20 border border-primary/40 ${className}`}
      style={style}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl!}
          alt={initials}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className="font-label font-bold text-primary leading-none select-none"
          style={{ fontSize: size * 0.35 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
